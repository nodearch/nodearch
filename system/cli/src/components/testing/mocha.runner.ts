import { ITestRunner, ITestRunnerSuite } from '@nodearch/core';
import Mocha from 'mocha';
const Test = Mocha.Test;


export class MochaRunner implements ITestRunner {
  private suites: ITestRunnerSuite[];

  constructor() {
    this.suites = [];
  }

  addSuite(suite: ITestRunnerSuite): void {
    this.suites.push(suite);
  }
  
  async run(): Promise<number> {

    const mochaInstance = new Mocha({});
    
    this.suites.forEach(suite => {
      const suiteInstance = Mocha.Suite.create(mochaInstance.suite, suite.name);
      suite.testCases.forEach(testCase => {
        suiteInstance.addTest(
          new Test(testCase.title, testCase.fn.bind(testCase.fn))
        );
      });
    });
  
    return await this.runMocha(mochaInstance);

    // process.on('exit', (code) => {
    //   process.exit(suiteRun.stats.failures)
    // });
    
    // suiteInstance.afterAll(function () {
    //   process.on('exit', (code) => {
    //     process.exit(suiteRun.stats.failures)
    //   })
    // })
  }

  private async runMocha (mochaInstance: Mocha): Promise<number> {
    return new Promise((resolve, reject) => {
      mochaInstance.run((failures) => {
        resolve(failures);
      });
    });
  }
}

