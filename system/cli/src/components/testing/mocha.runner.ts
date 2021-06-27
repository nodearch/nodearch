import { ITestRunner, ITestRunnerSuite } from '@nodearch/core';
import Mocha from 'mocha';
const Test = Mocha.Test;
const Hook = Mocha.Hook;


export class MochaRunner implements ITestRunner {
  private suites: ITestRunnerSuite[];

  constructor() {
    this.suites = [];
  }

  addSuite(suite: ITestRunnerSuite): void {
    this.suites.push(suite);
  }
  
  async run() {

    const mochaInstance = new Mocha({});
    
    this.suites.forEach(suite => {
      const suiteInstance = Mocha.Suite.create(mochaInstance.suite, suite.name);
      
      suite.beforeAll.forEach(beforeAll => {
        suiteInstance.beforeAll(
          beforeAll.title || beforeAll.fn.name,
          beforeAll.fn.bind(beforeAll.fn)
        );
      });

      suite.afterAll.forEach(afterAll => {
        suiteInstance.afterAll(
          afterAll.title || afterAll.fn.name,
          afterAll.fn.bind(afterAll.fn)
        );
      });

      suite.beforeEach.forEach(beforeEach => {
        suiteInstance.beforeEach(
          beforeEach.title || beforeEach.fn.name,
          beforeEach.fn.bind(beforeEach.fn)
        );
      });

      suite.afterEach.forEach(afterEach => {
        suiteInstance.afterEach(
          afterEach.title || afterEach.fn.name,
          afterEach.fn.bind(afterEach.fn)
        );
      });

      suite.testCases.forEach(testCase => {
        suiteInstance.addTest(
          new Test(testCase.title, testCase.fn ? testCase.fn.bind(testCase.fn) : undefined)
        );
      });
    });
  
    const failureCode = await this.runMocha(mochaInstance);
    process.exit(failureCode);
  }

  private async runMocha (mochaInstance: Mocha): Promise<number> {
    return new Promise((resolve, reject) => {
      mochaInstance.run((failures) => {
        resolve(failures);
      });
    });
  }
}

