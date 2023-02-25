import { Logger, Service } from "@nodearch/core";
import { spawn } from 'child_process';


@Service()
export class NpmService {
  private readonly npmCli: string;

  constructor() {
    this.npmCli = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  }

  async install(location: string) {
    await this.runNpmCommand(['i'], location);
  }

  private runNpmCommand(args: string[], location: string): Promise<void> {
    return new Promise((resolve, reject) => {

      const childProcess = spawn(this.npmCli, args, { stdio: 'inherit', cwd: location });
    
      childProcess.on('message', (msg) => {
        console.log(msg);
      });

      childProcess.on('error', (error) => {
        reject(error);
      });
  
      childProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        }
      });

    });
  }
}