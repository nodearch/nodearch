import { App, IAppInfo, Logger, Service } from '@nodearch/core';
import { AppLoader, AppLoadMode } from '@nodearch/core/fs';
import { pathToFileURL } from 'url';

@Service()
export class LocalAppService {
  
  localApp?: App;
  appInfo?: IAppInfo;

  constructor(
    private readonly logger: Logger
  ) {}

  async getApp() {
    if (!this.localApp) {
      await this.load();
    }
  
    return this.localApp;
  }
  
  private async load() {
    try {
      const appLoader = new AppLoader({ cwd: pathToFileURL(process.cwd()), appLoadMode: AppLoadMode.TS });
      this.localApp = await appLoader.load();
      this.appInfo = appLoader.appInfo;
    
      if (!this.localApp)
        throw new Error('No local app found');
      else 
        this.logger.debug('Local app loaded');
    }
    catch(e: any) {
      this.logger.debug('Failed to load local app');
      this.logger.debug(e.message);
    }
  }
}