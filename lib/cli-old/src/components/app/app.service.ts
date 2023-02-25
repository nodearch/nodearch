import { CoreAnnotation, ICommand, Logger, Service, IAppInfo, App, FileSystem } from '@nodearch/core';
import path from 'path';


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
    
    this.appInfo = await this.getAppInfo();

    if (!this.appInfo) return;

    const LocalApp = (await FileSystem.importFile(this.appInfo.paths.files.app))?.default;

    // TODO: throw error instead?
    if (!LocalApp.nodearch) return;

    this.app = new LocalApp();

    if (this.app) {
      await this.app.init({
        mode: 'app',
        appInfo: this.appInfo 
      });
    }
  }

  private async getAppInfo() {
    try {
      return await App.getAppInfo(path.join(process.cwd(), 'package.json'));
    }
    catch(e: any) {
      if (e.code !== 'MODULE_NOT_FOUND') throw e;
    }
  }
}