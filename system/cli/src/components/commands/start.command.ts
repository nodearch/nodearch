import { Logger, ClassConstructor, App, ICli, CLIBuilder, Cli, INpmDependency, NpmDependencyType } from '@nodearch/core';
import { AppInfoService } from '../app-info/app-info.service';
import path from 'path';
import { NotifierService } from '../notifier.service';
import { CmdRunner } from '../cli-exec';


@Cli()
export class StartCommand implements ICli {

  command: string;
  describe: string;
  aliases: string[];
  builder: CLIBuilder;
  npmDependencies: INpmDependency[];

  constructor(
    private readonly logger: Logger, 
    private readonly appInfoService: AppInfoService,
    private readonly notifierService: NotifierService,
    private readonly cmdRunner: CmdRunner
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
    
    this.npmDependencies = [
      {
        name: 'ts-node',
        type: NpmDependencyType.DevDependency
      },
      {
        name: 'nodemon',
        type: NpmDependencyType.DevDependency
      }
    ];
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
      this.cmdRunner.runTsNode(path.join(this.appInfoService.appInfo.rootDir, 'start.ts'));
    }
    else {
      this.logger.error('you must build app first before start');
    }
  }

  private async startWatch(data: any) {
    if (this.appInfoService.appInfo) {


      const nodemon = (await import(path.join(this.appInfoService.cwd, 'node_modules', 'nodemon'))).default;
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
        .on('crash', (...args: any) => {
          this.notifierService.notify('Your APP Crashed!');
        })
        .once('start', (...args: any) => {
          this.notifierService.notify('Your APP started in watch mode!');
        });

    }
    else {
      this.logger.error('you must build app first before start');
    }
  }
}
