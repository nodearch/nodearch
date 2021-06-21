import { ITestRunner } from './test.interfaces';
import { Container } from 'inversify';
import { ClassConstructor } from '../../utils';
import { TestMetadata } from './test.metadata';

export class TestManager {
  constructor(private testRunner: ITestRunner, private testComponents: ClassConstructor[], private container: Container) {}

  private init() {
    const testCompInfo = this.testComponents.map(testComp => {
      const container = Container.merge(this.container, new Container());
      return {
        compConstructor: testComp,
        compInstance: container.get(testComp)
      };
    });

    testCompInfo.forEach(({ compConstructor, compInstance }) => {
      const testCases = TestMetadata.getTestCases(compConstructor);
      const testInfo = TestMetadata.getTestInfo(compConstructor);

      if (!testInfo) throw new Error('Invalid @Test component options');

      this.testRunner.addSuite({
        name: testInfo.title,
        before: [],
        after: [],
        beforeEach: [],
        afterEach: [],
        testCases: testCases.map(testCase => {
          return {
            title: testCase.title,
            fn: compInstance[testCase.method].bind(compInstance)
          };
        })
      });
    });
  }

  async run () {
    this.init();
    return await this.testRunner.run();
  }
}