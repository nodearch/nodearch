import { fork, ForkedFunctions } from 'fork-child';
import { ChildProcess } from 'node:child_process';
import path from 'node:path';


export class NodeArchBridge {
  
  private fn: ForkedFunctions;
  private child: ChildProcess;
  private appDirUrl: URL;

  constructor(appDirUrl: URL) {
    this.appDirUrl = appDirUrl;

    const appServerFileUrl = this.getAppServerFileUrl();
    const { functions, child } = fork(appServerFileUrl, {
      stdio: 'inherit'
    }); 

    this.fn = functions;
    this.child = child;
  }

  private getAppServerFileUrl() {
    const ext = path.extname(import.meta.url);
    return new URL('./app-server' + ext, import.meta.url);
  }


  async getCommands() {
    return await this.fn.getCommands(this.appDirUrl);
  }

  kill() {
    this.child.kill();
  }
}
