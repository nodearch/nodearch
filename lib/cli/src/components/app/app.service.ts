import { CoreAnnotation, ICommand, Logger, Service, IAppInfo, App, FileSystem } from '@nodearch/core';


@Service()
export class AppService {

  appInfo?: IAppInfo;
  app?: App;

  constructor(
    private readonly logger: Logger
  ) {}

  getCommands() {
    let commands: ICommand[] = [];
    
    if (this.app) {
      commands = this.app.getAll<ICommand>(CoreAnnotation.Command);
    }

    return commands;
  }

  async load() {
    this.logger.info('Scanning for a local App...'); 
    
    const appInfo = await this.getAppInfo();

    if (!appInfo) return;

    const LocalApp = (await FileSystem.importFile(appInfo.paths.files.app))?.default;
    
    // TODO: throw error instead?
    if (!LocalApp.nodearch) return;

    this.app = new LocalApp();

    if (this.app) {
      await this.app.init({
        mode: 'app',
        appInfo: appInfo 
      });
    }
  }

  private async getAppInfo() {
    try {
      return await App.getAppInfo(FileSystem.resolvePath(process.cwd(), 'node_modules'));
    }
    catch(e: any) {
      if (e.code !== 'MODULE_NOT_FOUND') throw e;
    }
  }
}