import { ITestRunner } from './test.interfaces';
import { Container } from 'inversify';
import { ClassConstructor } from '../../utils';
import { TestMetadata } from './test.metadata';
import { TestBox } from './test-box';

export class TestManager {
  constructor(
    private testRunner: ITestRunner, 
    private testComponents: ClassConstructor[], 
    private container: Container
  ) {}

  private init() {
    const testCompInfo = this.testComponents.map(testComp => {      
      const container = Container.merge(this.container, new Container());
      container.bind(TestBox).toConstantValue(new TestBox(container as Container));
      
      return {
        compConstructor: testComp,
        compInstance: container.get(testComp)
      };
    });

    testCompInfo.forEach(({ compConstructor, compInstance }) => {
      const testInfo = TestMetadata.getTestInfo(compConstructor);

      if (!testInfo) throw new Error('Invalid @Test component options');

      this.testRunner.addSuite({
        name: testInfo.title,
        beforeAll: this.getBeforeAll(compConstructor, compInstance),
        afterAll: this.getAfterAll(compConstructor, compInstance),
        beforeEach: this.getBeforeEach(compConstructor, compInstance),
        afterEach: this.getAfterEach(compConstructor, compInstance),
        testCases: this.getCases(compConstructor, compInstance)
      });
    });
  }

  private getCases(compConstructor: ClassConstructor, compInstance: any) {
    return TestMetadata.getCases(compConstructor)
      .map(testCase => {
        return {
          title: testCase.title,
          fn: testCase.active ? compInstance[testCase.method].bind(compInstance) : undefined
        };
      });
  }

  private getBeforeAll(compConstructor: ClassConstructor, compInstance: any) {
    return TestMetadata.getBeforeAll(compConstructor)
      .map(beforeAll => {
        return {
          title: beforeAll.title,
          fn: compInstance[beforeAll.method].bind(compInstance)
        };
      });
  }

  private getAfterAll(compConstructor: ClassConstructor, compInstance: any) {
    return TestMetadata.getAfterAll(compConstructor)
      .map(afterAll => {
        return {
          title: afterAll.title,
          fn: compInstance[afterAll.method].bind(compInstance)
        };
      });
  }

  private getBeforeEach(compConstructor: ClassConstructor, compInstance: any) {
    return TestMetadata.getBeforeEach(compConstructor)
      .map(beforeEach => {
        return {
          title: beforeEach.title,
          fn: compInstance[beforeEach.method].bind(compInstance)
        };
      });
  }

  private getAfterEach(compConstructor: ClassConstructor, compInstance: any) {
    return TestMetadata.getAfterEach(compConstructor)
      .map(afterEach => {
        return {
          title: afterEach.title,
          fn: compInstance[afterEach.method].bind(compInstance)
        };
      });
  }

  async run () {
    this.init();
    await this.testRunner.run();
  }
}