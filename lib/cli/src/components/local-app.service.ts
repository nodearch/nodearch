import { Logger, Service } from '@nodearch/core';
import { AppLoader, AppLoadMode } from '@nodearch/core/fs';
import { pathToFileURL } from 'url';

@Service()
export class LocalAppService {
  
  private logger: Logger;
  private appLoader: AppLoader;

  constructor(logger: Logger) {
    this.logger = logger;
    this.appLoader = new AppLoader({ cwd: pathToFileURL(process.cwd()), appLoadMode: AppLoadMode.TS });
  }

  async init() {
    await this.load();
  }

  private async load() {
    try {
      const localApp = await this.appLoader.load();
    
      if (!localApp)
        this.logger.debug('No local app found');
      else 
        this.logger.debug('Local app loaded');
    }
    catch(e: any) {
      if (this.appLoader.isAppDir) {
        this.logger.error('Error when trying to load a NodeArch app from the local directory\n', e.message, '\n');
      }
    }
  }

  get app() {
    return this.appLoader.app;
  }

  get info() {
    return this.appLoader.appInfo;
  }

  get isAppDir() {
    return this.appLoader.isAppDir;
  }
}