import { App, ClassConstructor, Cli, CLIBuilder, ICli, INpmDependency, Logger, NpmDependencyType, RunMode, ITestRunner } from "@nodearch/core";
import { AppInfoService } from "../app-info/app-info.service";
import { ITestCommandOptions } from './testing.interfaces';
import path from 'path';
import open from 'open';
import { MochaRunner } from './mocha/mocha.runner';
import { nycOptions } from './mocha/mocha.options';


@Cli()
export class TestCommand2 implements ICli<ITestCommandOptions> {
  command: string;
  aliases: string[];
  describe: string;
  npmDependencies: INpmDependency[];
  builder: CLIBuilder;

  constructor(
    private readonly appInfoService: AppInfoService,
    private readonly logger: Logger
  ) {

    this.command = 'test2';
    this.aliases = ['t'];
    this.describe = 'run automated testing';

    this.builder = {
      runner: {
        alias: ['r'],
        describe: 'test runner to use',
        default: 'mocha'
      },
      coverage: {
        alias: ['c'],
        describe: 'test coverage',
        boolean: true,
        default: false
      }
    };

    this.npmDependencies = [
      { 
        name: 'mocha', 
        type: NpmDependencyType.DevDependency, 
        when: (data: ITestCommandOptions) => data.runner === 'mocha' 
      },
      { 
        name: 'nyc', 
        type: NpmDependencyType.DevDependency, 
        when: (data: ITestCommandOptions) => data.coverage ? true : false
      }
    ];
  }

  async handler(options: ITestCommandOptions) {
    if (this.appInfoService.appInfo) {

      if (options.runner === 'mocha') {
        let nyc: any;

        if (options.coverage) {
          const NYC = (await this.appInfoService.importNpmPkg('nyc'))?.default;
          nyc = new NYC(nycOptions);
          await nyc.reset();
          await nyc.wrap();
          // TODO currently we're cleaning the require cache in the core, we need to validate this
          await nyc.addAllFiles();
        }
        
        const App: ClassConstructor<App> = (await import(this.appInfoService.appInfo.app))?.default;
        const appInstance = new App();
  
        this.logger.info('Starting an APP instance in Testing mode...');

        // TODO: this runs the APP for a second time
        await appInstance.run({ mode: RunMode.TEST, 
          testRunner: new MochaRunner(nyc)
        });
      }
      else {
        throw new Error(`Test Runner ${options.runner} is not supported!`);
      }

    }
    else {
      this.logger.error('This command can be only ran in an existing NodeArch APP root directory');
    }
  }
}