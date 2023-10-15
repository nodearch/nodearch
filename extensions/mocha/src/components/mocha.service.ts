import { AppContext, Logger, Service } from '@nodearch/core';
import Mocha, {Test} from 'mocha';
import { ITestOptions } from './test.interfaces.js';
import { TestService } from './test.service.js';
import { TestMode } from '../index.js';


@Service()
export class MochaService {

  constructor(
    private readonly testService: TestService,
    private readonly appContext: AppContext,
    private readonly logger: Logger
  ) {}

  async run(options: ITestOptions) {
    this.logger.info('Running test cases using Mocha');

    const suites = await this.testService.getTestSuitesInfo(options.mode);
  
    const mochaInstance = new Mocha(options.mochaOptions);

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
  
    if (options.mode.includes(TestMode.E2E)) {
      await this.appContext.start();
    }

    const code: number = await (new Promise((resolve, reject) => {
      mochaInstance.run((failures) => {
        resolve(failures);
      });
    }));

    return code;
  }
}