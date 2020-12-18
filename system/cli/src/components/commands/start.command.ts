import { Logger, ClassConstructor, App, ICLI, CLIBuilder, CLI } from '@nodearch/core';
import { AppInfoService } from '../app-info/app-info.service';
import nodemon from 'nodemon';
import { NotifierService } from '../notifier.service';


@CLI()
export class StartCommand implements ICLI {

  command: string;
  describe: string;
  aliases: string[];
  builder: CLIBuilder;

  constructor(
    private readonly logger: Logger, 
    private readonly appInfoService: AppInfoService,
    private readonly notifierService: NotifierService
  ) {

    this.command = 'start';
    this.describe = 'Start NodeArch APP';
    this.aliases = ['s'];
    this.builder = {
      dev: {
        alias: 'd',
        boolean: true,
        describe: 'start app with ts-node'
      },
      watch: {
        alias: 'w',
        boolean: true,
        describe: 'start app with nodemon'
      }
    };
  }

  async handler(data: any) {
    if (data.watch) {
      await this.startWatch(data);
    }
    else {
      await this.start(data);
    }
  }

  private async start(data: any) {
    if (this.appInfoService.appInfo) {
      const App: ClassConstructor<App> = (await import(this.appInfoService.appInfo.app))?.default;
      const appInstance = new App();
      await appInstance.run();
    }
    else {
      this.logger.error('you must build app first before start');
    }
  }

  private async startWatch(data: any) {
    if (this.appInfoService.appInfo) {

      const nodemonInstance = nodemon({
        watch: [this.appInfoService.appInfo.rootDir],
        ext: 'ts',
        exec: `node -e "require('ts-node').register({}); const App = require('${this.appInfoService.appInfo.app}').default; (new App()).run();"`,
        ignore: [
          'node_modules/**/node_modules',
          'src/**/*.spec.ts',
          'src/**/*.e2e-spec.ts'
        ],
        legacyWatch: true
      });


      nodemonInstance
        .on('crash', (...args) => {
          this.notifierService.notify('Your APP Crashed!');
        })
        .once('start', (...args) => {
          this.notifierService.notify('Your APP started in watch mode!');
        });

    }
    else {
      this.logger.error('you must build app first before start');
    }
  }
}
