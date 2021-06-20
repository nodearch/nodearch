import { ITestRunner } from './test.interfaces';

export class TestManager {
  constructor(private testRunner: ITestRunner, private testComponents: object[]) {}

  init() {
    this.testComponents.forEach(testComp => {
      this.testRunner.addSuite({
        name: 'this is suite name',
        before: [],
        after: [],
        beforeEach: [],
        afterEach: [],
        testCases: [
          async () => {
            // TODO: one way of doing it is by adding the snapshot and restore in a before [Suite] - But concurrent test cases will sure fail
            (testComp as any).one();
          }
        ]
      });
    });
  }

  async run () {
    return await this.testRunner.run();
  }
}