import { App, ClassConstructor, Cli, CLIBuilder, ICli, INpmDependency, Logger, NpmDependencyType, RunMode } from "@nodearch/core";
import { AppInfoService } from "../app-info/app-info.service";
import { ITestCommandOptions } from './testing.interfaces';
import path from 'path';
import open from 'open';
import { MochaRunner } from './mocha.runner';


@Cli()
export class TestCommand2 implements ICli<ITestCommandOptions> {
  command: string;
  aliases: string[];
  describe: string;
  npmDependencies: INpmDependency[];

  constructor(
    private readonly appInfoService: AppInfoService,
    private readonly logger: Logger
  ) {

    this.command = 'test2';
    this.aliases = ['t'];
    this.describe = 'run automated testing';

    this.npmDependencies = [
      { name: 'mocha', type: NpmDependencyType.DevDependency }, 
      // { name: 'ts-jest', type: NpmDependencyType.DevDependency }
    ];
  }

  async handler(options: ITestCommandOptions) {
    if (this.appInfoService.appInfo) {
      // this.logger.info('Running Tests...');

      const App: ClassConstructor<App> = (await import(this.appInfoService.appInfo.app))?.default;
      const appInstance = new App();
      // TODO: this runs the APP for a second time
      await appInstance.run({ mode: RunMode.TEST, 
        testRunner: new MochaRunner()
      });

      // const Mocha = (await import(path.join(this.appInfoService.cwd, 'node_modules', 'mocha')));
      // const Test = Mocha.Test;

      // const mochaInstance = new Mocha();
      // const suiteInstance = Mocha.Suite.create(mochaInstance.suite, 'Test Suite');

      // suiteInstance.addTest(new Test('testing tests', function(){
      //   console.log('test case');
      // }))
      
      // const suiteRun: any = mochaInstance.run()
      // process.on('exit', (code) => {
      //   process.exit(suiteRun.stats.failures)
      // });
      
      // suiteInstance.afterAll(function () {
      //   process.on('exit', (code) => {
      //     process.exit(suiteRun.stats.failures)
      //   })
      // })

    }
    else {
      this.logger.error('This command can be only ran in an existing NodeArch APP root directory');
    }
  }
}