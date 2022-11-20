import { IAppInfo, Logger, Service, TestMode } from '@nodearch/core';
import Mocha, {Test} from 'mocha';
import NYC from 'nyc';
import { ITestOptions } from './test.interfaces';


@Service()
export class MochaService {

  constructor(
    private readonly logger: Logger
  ) {}

  async run(appInfo: IAppInfo, options: ITestOptions) {

    this.logger.info('Running test cases using Mocha');

    let nyc: NYC | undefined = undefined;

    if (options.coverage) {
      nyc = new NYC(
        {
          _: [ 'node' ],
          // cwd: 'D:\\dev\\nodearch\\templates\\standalone',
          cwd: process.cwd(),
          all: true,
          a: true,
          checkCoverage: false,
    
          extension: [ '.ts' ],
          e: [ '.ts' ],
          include: [ 'src/**/**.ts' ],
          n: [ 'src/**/**.ts' ],
    
          // exclude: [ 'node_modules', 'src/**/**.spec.js' ],
          // x: [ 'node_modules', 'src/**/**.spec.js' ],
          reporter: [ 'lcov', 'text' ],
          r: [ 'lcov', 'text' ],
          reportDir: './coverage',
          skipFull: false,
          tempDir: './.nyc_output',
          t: './.nyc_output',
          nycrcPath: undefined,
          excludeNodeModules: true,
          ignoreClassMethods: [],
          autoWrap: true,
          esModules: true,
          parserPlugins: [
            'asyncGenerators',
            'bigInt',
            'classProperties',
            'classPrivateProperties',
            'classPrivateMethods',
            'dynamicImport',
            'importMeta',
            'numericSeparator',
            'objectRestSpread',
            'optionalCatchBinding',
            'topLevelAwait'
          ],
          compact: true,
          preserveComments: true,
          produceSourceMap: true,
          sourceMap: true,
          require: [],
          i: [],
          instrument: true,
          excludeAfterRemap: true,
          branches: 0,
          functions: 0,
          lines: 90,
          statements: 0,
          perFile: false,
          showProcessTree: false,
          skipEmpty: false,
          silent: false,
          s: false,
          eager: false,
          cache: true,
          c: true,
          cacheDir: undefined,
          babelCache: false,
          useSpawnWrap: false,
          hookRequire: true,
          hookRunInContext: false,
          hookRunInThisContext: false,
          clean: true,
          inPlace: false,
          exitOnError: false,
          delete: false,
          completeCopy: false,
          instrumenter: './lib/instrumenters/istanbul'
        }
      );
      await nyc.reset();
      await nyc.wrap();
      await nyc.addAllFiles();
    }

    const MainApp: any = (await import(appInfo.paths.app)).default;

    const app = new MainApp();
    await app.run();
    await app.init();
    await app.start();
  
    const suites = app.getTestSuites([TestMode.UNIT]);

    const mochaInstance = new Mocha(options as any);

    suites.forEach((suite: any) => {
      const suiteInstance = Mocha.Suite.create(mochaInstance.suite, suite.name);
  
      suite.beforeAll.forEach((beforeAll: any) => {
        suiteInstance.beforeAll(
          beforeAll.title || beforeAll.fn.name,
          beforeAll.fn.bind(beforeAll.fn)
        );
      });
  
      suite.afterAll.forEach((afterAll: any) => {
        suiteInstance.afterAll(
          afterAll.title || afterAll.fn.name,
          afterAll.fn.bind(afterAll.fn)
        );
      });
  
      suite.beforeEach.forEach((beforeEach: any) => {
        suiteInstance.beforeEach(
          beforeEach.title || beforeEach.fn.name,
          beforeEach.fn.bind(beforeEach.fn)
        );
      });
  
      suite.afterEach.forEach((afterEach: any) => {
        suiteInstance.afterEach(
          afterEach.title || afterEach.fn.name,
          afterEach.fn.bind(afterEach.fn)
        );
      });
  
      suite.testCases.forEach((testCase: any) => {
        suiteInstance.addTest(
          new Test(testCase.title, testCase.fn ? testCase.fn.bind(testCase.fn) : undefined)
        );
      });
  
    });
  
    const code: number = await (new Promise((resolve, reject) => {
      mochaInstance.run((failures) => {
        resolve(failures);
      });
    }));
  
    if (nyc) {
      await nyc.writeCoverageFile();
      await nyc.report();
    }

    return code;
  }
}