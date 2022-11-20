import path from 'path';
import { CoreAnnotation, ICommand, Logger, Service } from '@nodearch/core';
import { IAppConfig, IAppInfo } from './app.interfaces';


@Service()
export class AppService {

  appInfo?: IAppInfo;

  constructor(
    private readonly logger: Logger
  ) {}

  getCommands() {
    let commands: ICommand[] = [];
    
    if (this.appInfo) {
      commands = this.appInfo.app.getAll<ICommand>(CoreAnnotation.Command);
    }

    return commands;
  }

  async load() {
    this.logger.info('Scanning for a local App...');
    
    const appConfig = await this.getAppConfig();

    if (!appConfig) return;

    const LocalApp = (await this.importIfExist(appConfig.path))?.default;
    
    if (!LocalApp.nodearch) return;

    const app = new LocalApp();
    await app.run(); 

    this.appInfo = {
      paths: {
        root: this.resolvePath(process.cwd()),
        nodeModules: this.resolvePath(path.join(process.cwd(), 'node_modules')),
        app: appConfig.path
      },
      app
    };
  }

  private async getAppConfig() {
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pkg = await this.importIfExist(pkgPath); 
    
    if (pkg && pkg.nodearch && pkg.nodearch.path) {
      pkg.nodearch.path = this.resolvePath(pkg.nodearch.path);
      return pkg.nodearch as IAppConfig;
    }
  }

  private async importIfExist(path: string) {
    try {
      return await import(path);
    }
    catch(e: any) {
      if (e.code !== 'MODULE_NOT_FOUND') throw e;
    }
  }

  private resolvePath(strPath: string) {
    return (path.isAbsolute(strPath) ? 
      path.normalize(strPath) : path.resolve(strPath)).replace(/\\/g, '/');
  }
}