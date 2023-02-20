import { Command, ICommand } from '@nodearch/command';
import { AppContext, Logger } from '@nodearch/core';
import nodemon from 'nodemon';
import path from 'path';
import { fileURLToPath } from 'url';
import { LocalAppService } from '../../local-app.service.js';


@Command()
export class StartCommand implements ICommand {

  constructor(
    private readonly localAppService: LocalAppService,
    private readonly appContext: AppContext,
    private readonly logger: Logger
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

    /**
     * a local app should always exist since the command will 
     * be excluded if the app didn't exist.
     * 
     * This is just a safety check
     */
    if (!localApp || !localApp.info) return;

    if (!options.watch) {
      return await localApp.start();
    }

    const starterScriptPath = path.join(
      fileURLToPath(this.appContext.appInfo.paths.appDir), 
      'utils', 'app-starter.ts'
    );

    // Watch Mode
    nodemon({
      watch: [fileURLToPath(localApp.info.paths.appDir)],
      ext: 'ts',
      exec: `ts-node --transpileOnly --esm --swc ${starterScriptPath} rootDir=${localApp.info.paths.rootDir} appPath=${localApp.info.paths.app}`,
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