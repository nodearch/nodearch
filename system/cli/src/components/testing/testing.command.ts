// import { Cli, CLIBuilder, ICli, INpmDependency, Logger, NpmDependencyType } from "@nodearch/core";
// import { AppInfoService } from "../app-info/app-info.service";
// import { ITestCommandOptions } from './testing.interfaces';
// import path from 'path';
// import open from 'open';


// @Cli()
// export class TestCommand implements ICli<ITestCommandOptions> {
//   command: string;
//   aliases: string[];
//   describe: string;
//   builder: CLIBuilder;
//   npmDependencies: INpmDependency[];

//   constructor(
//     private readonly appInfoService: AppInfoService,
//     private readonly logger: Logger
//   ) {

//     this.command = 'test';
//     this.aliases = ['t'];
//     this.describe = 'run automated testing';
//     this.builder = {
//       unit: {
//         alias: ['u'],
//         describe: 'run unit testing'
//       },
//       e2e: {
//         alias: ['e'],
//         describe: 'run end to end testing'
//       },
//       watch: {
//         alias: ['w'],
//         describe: 'run in watch mode'
//       },
//       files: {
//         alias: ['f'],
//         describe: 'file names to include in the test cases',
//         type: 'array'
//       },
//       dirs: {
//         alias: ['d'],
//         describe: 'directories with test files to be included',
//         type: 'array'
//       },
//       coverage: {
//         alias: ['c'],
//         describe: 'generate code coverage report'
//       },
//       maxConcurrency: {
//         describe: 'specify the amount of tests at the same time',
//         default: 1
//       },
//       maxWorkers: {
//         describe: 'specify the maximum number of workers',
//         default: 1      
//       },
//       isolatedModules: {
//         describe: 'Disable type-checking',
//         default: true
//       },
//       verbose: {
//         type: 'boolean',
//         default: false,
//         describe: 'Display individual test results with the test suite hierarchy.'
//       },
//       open: {
//         alias: ['o'],
//         describe: 'open coverage output in the default browser'
//       }
//     };

//     this.npmDependencies = [
//       { name: 'jest', type: NpmDependencyType.DevDependency }, 
//       { name: 'ts-jest', type: NpmDependencyType.DevDependency }
//     ];
//   }

//   async handler(options: ITestCommandOptions) {
//     if (this.appInfoService.appInfo) {
//       this.logger.info('Running Tests...');

//       const { runCLI } = (await import(path.join(this.appInfoService.cwd, 'node_modules', 'jest')));

//       const exts = options.e2e ? (options.unit ? 'spec|e2e-spec' : 'e2e-spec') : 'spec';
//       const files = options.files ? options.files.join('|') : '*';
//       const dirs = options.dirs ? options.dirs.join('|') : '*'; 

//       const jestOptions: any = {
//         preset: 'ts-jest',
//         testEnvironment: 'node',
//         roots: [this.appInfoService.appInfo.rootDir],
//         testMatch: [`(**/(${dirs}))/?((${files}).)+(${exts}).ts?(x)`],
//         passWithNoTests: true,
//         collectCoverageFrom: ["src/**/*.ts", "!src/main.ts", "!src/start.ts"],
//         verbose: options.verbose,
//         maxConcurrency: options.maxConcurrency,
//         maxWorkers: options.maxWorkers,
//         globals: {
//           'ts-jest': {
//             isolatedModules: options.isolatedModules
//           },
//         },
//       };

//       if (options.coverage) {
//         jestOptions.coverage = true;
//       }

//       if (options.watch) {
//         jestOptions.watch = true;
//       }

//       const {results} = await runCLI(jestOptions, [this.appInfoService.appInfo.rootDir]);

//       if (results.success) {
//         this.logger.info(`Tests completed.`);
//         if (options.open && options.coverage) {
//           await open(path.join(this.appInfoService.cwd, 'coverage', 'lcov-report', 'index.html'));
//         }

//         process.exit(0);
//       }
//       else {
//         this.logger.error(`Tests failed.`);
//         process.exit(1);
//       }

//     }
//     else {
//       this.logger.error('This command can be only ran in an existing NodeArch APP root directory');
//     }
//   }
// }