import { Logger, Service } from '@nodearch/core';
import { AppLoader } from '@nodearch/core/fs';
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';
import { getLoadMode } from '../utils/load-mode.js';


@Service()
export class LocalAppService {

  hasLoadError: boolean;

  private logger: Logger;
  private appLoader: AppLoader;

  constructor(logger: Logger) {
    this.hasLoadError = false;
    this.logger = logger;
    this.appLoader = new AppLoader({ cwd: pathToFileURL(cwd()), loadMode: getLoadMode(), initMode: 'init' });
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
      this.hasLoadError = true;
    }
  }

  get app() {
    return this.appLoader.app;
  }

  get info() {
    return this.appLoader.appSettings;
  }

  get isAppDir() {
    return this.appLoader.isAppDir;
  }
}