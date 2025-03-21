import { Command, ICommand } from '@nodearch/command';
import { AppContext, Logger } from '@nodearch/core';
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
    const localApp = await this.localAppService.app;
    const localAppInfo = await this.localAppService.info;

    // Safety check
    if (!localApp || !localAppInfo) return;

    if (!options.watch) {
      this.logger.info('Starting your app...');
      return await localApp.start();
    }

    const ext = this.appContext.getSettings().loadMode;

    const starterScriptPath = path.join(
      fileURLToPath(this.appContext.getSettings().paths.appDir), 
      'utils', 'app-starter.' + ext 
    );

    (nodemon as any)({
      watch: [fileURLToPath(localAppInfo.paths.appDir)],
      ext: 'ts',
      cwd: fileURLToPath(localAppInfo.paths.rootDir),
      script: starterScriptPath,
      legacyWatch: true
    });

    (nodemon as any)
      .on('start', () => {
        this.logger.info('App started in watch mode');
      })
      .on('quit', () => {
        this.logger.info('App has quit');
        process.exit();
      })
      .on('restart', (files: any) => {
        this.logger.info('App restarted due to: ', files);
      });
  }

}