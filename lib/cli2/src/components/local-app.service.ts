import { App, Logger, Service } from '@nodearch/core';
import { AppLoader, AppLoadMode } from '@nodearch/core/fs';
import { pathToFileURL } from 'url';

@Service()
export class LocalAppService {
  private localApp?: App;

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
      this.localApp = await (
        new AppLoader({ 
          cwd: pathToFileURL(process.cwd()), 
          appLoadMode: AppLoadMode.TS 
        })
      ).load();
    
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