import { AppContext, Logger, Service } from '@nodearch/core';
import { AppLoader, AppLoadMode } from '@nodearch/core/fs';
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';


@Service()
export class LocalAppService {

  hasLoadError: boolean;

  private logger: Logger;
  private appLoader: AppLoader;

  constructor(logger: Logger) {
    this.hasLoadError = false;
    this.logger = logger;
    this.appLoader = new AppLoader({ cwd: pathToFileURL(cwd()), loadMode: this.getLoadMode(), initMode: 'init' });
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

  private getLoadMode() {
    /**
     * Yargs is not loaded yet, so we need to parse the arguments manually
     * But we're still including this argument in the yargs config in commands/start/start.command.ts
     * For validation.
     */
    let loadMode = AppLoadMode.TS;

    const flagIndex = process.argv.findIndex(x => x.startsWith('--loadMode') || x.startsWith('-m'));
  
    if (flagIndex === -1) return loadMode;

    const flagKey = process.argv[flagIndex];

    const flagHasValue = flagKey.includes('=');

    if (flagHasValue) {
      loadMode = flagKey.split('=')[1] as AppLoadMode;
    }
    else {
      const value = process.argv[flagIndex + 1];
      if (value && !value.startsWith('-')) {
        loadMode = value as AppLoadMode;
      }
    }
    
    return loadMode;
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