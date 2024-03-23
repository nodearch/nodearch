import { CommandDecorator, ICommand, CommandService } from '@nodearch/command';
import { AppContext, Hook, IHook, Logger } from '@nodearch/core';
import { LocalAppService } from './local-app.service.js';


@Hook()
export class CliHook implements IHook {

  constructor(
    private readonly commandService: CommandService,
    private readonly localAppService: LocalAppService,
    private readonly logger: Logger,
    private readonly appContext: AppContext,
  ) {}

  async onStart() {
    // Set by global CLI
    const cliVersion = process.env.NODEARCH_CLI_VERSION;
    const currentCliVersion = this.appContext.getSettings().version;

    if (cliVersion && cliVersion !== currentCliVersion) {
      this.logger.info(`Starting NodeArch CLI using local version v${currentCliVersion} - global version is ${cliVersion}`);
    }
    else {
      this.logger.info(`Starting NodeArch CLI v${this.appContext.getSettings().version}`);
    }

    this.logger.info(`Log Level: ${this.logger.getLogLevel()}`);
    this.logger.info(`Check https://nodearch.io for documentation and guides`);
    
    // Scan & Load local app
    await this.localAppService.init();

    let localAppCommands: ICommand[] = [];

    const excludedCommands: string[] = [];
    
    if (this.localAppService.isAppDir) {
      const localApp = this.localAppService.app;
      const localAppInfo = this.localAppService.info;

      if (localAppInfo) {
        this.logger.info(`Local app loaded: ${localAppInfo.name} v${localAppInfo.version} - ${localAppInfo.loadMode.toUpperCase()} Mode`);
      }
      else {
        this.logger.warn(`Local app might be in an invalid state.`)
      }

      /**
       * The fact that we are in an app directory doesn't mean
       * that the app exists or loaded correctly, so we still
       * need to check if the app is loaded correctly
       */
      if (localApp && !this.localAppService.hasLoadError) {
        localAppCommands = localApp.getContainer().getById<ICommand>(CommandDecorator.COMMAND);
      }
      else {
        excludedCommands.push('start');
      }

      excludedCommands.push('new');
    }
    else {
      excludedCommands.push('start');
      excludedCommands.push('build');
    }

    await this.commandService.start({ commands: localAppCommands, exclude: excludedCommands });
  }
}