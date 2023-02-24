import { Command, ICommand } from '@nodearch/command';
import { AppContext, Logger } from '@nodearch/core';
import { AppLoader } from '@nodearch/core/fs';
import nodemon from 'nodemon';
import path from 'path';
import { fileURLToPath } from 'url';
import { LocalAppService } from '../../local-app.service.js';


@Command()
export class StartCommand implements ICommand {

  constructor(
    private readonly appContext: AppContext,
    private readonly logger: Logger,
    private readonly localAppService: LocalAppService
  ) {}

  command = 'start';
  describe = 'Starts the application';
  aliases = 's';
  builder = {
    watch: {
      alias: 'w',
      boolean: true,
      describe: 'Start in watch mode [nodemon]'
    }
  };

  async handler(options: any) {
    const localApp = await this.localAppService.getApp();

    // Safety check
    if (!localApp || !this.localAppService.appInfo) return;

    if (!options.watch) {
      return await localApp.start();
    }

    const starterScriptPath = path.join(
      fileURLToPath(this.appContext.appInfo.paths.appDir), 
      'utils', 'app-starter.ts'
    );

    // Watch Mode
    nodemon({
      watch: [fileURLToPath(this.localAppService.appInfo.paths.appDir)],
      ext: 'ts',
      exec: `ts-node --transpileOnly --esm --swc ${starterScriptPath} rootDir=${this.localAppService.appInfo.paths.rootDir}`,
      legacyWatch: true
    });

    nodemon
      .on('start', () => {
        this.logger.info('App started in watch mode');
      })
      .on('quit', () => {
        this.logger.info('App has quit');
        process.exit();
      })
      .on('restart', (files) => {
        this.logger.info('App restarted due to: ', files);
      });
  }

}