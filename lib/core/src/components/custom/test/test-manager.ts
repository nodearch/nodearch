import { IComponentOverride, ITestRunner, ITestSuiteMetadata, TestHook } from './test.interfaces';
import { Container } from 'inversify';
import { TestMetadata } from './test.metadata';
import { TestBox } from './test-box';
import { TestMode } from '.';
import { ClassConstructor } from '../../../utils';

// TODO: revisit this after the new components changes
export class TestManager {
  constructor(
    private testRunner: ITestRunner, 
    private testComponents: ClassConstructor[],
    private testMode: TestMode[],
    private container: Container
  ) {}

  init() {
    const suiteComps = this.getTestComponents();

    suiteComps.forEach(suite => {
      // Create a clone from the original container
      const container = Container.merge(this.container, new Container()) as Container;
      
      // Bind an instance of the TestBox to the cloned container
      container.bind(TestBox).toConstantValue(new TestBox(container));

      const suiteOverrides = this.getSuiteOverrides(suite.comp, container);
      this.applyOverrides(suiteOverrides, container);

      const compInstance = container.get(suite.comp);

      this.testRunner.addSuite({
        name: suite.info.title,
        beforeAll: this.getBeforeAll(suite.comp, compInstance),
        afterAll: this.getAfterAll(suite.comp, compInstance),
        beforeEach: this.getBeforeEach(suite.comp, compInstance),
        afterEach: this.getAfterEach(suite.comp, compInstance),
        testCases: this.getCases(suite.comp, compInstance)
      });
    });
  }

  private getTestComponents() {
    const suiteComps: { info: ITestSuiteMetadata, comp: ClassConstructor }[] = [];

    this.testComponents
      .forEach(compConstructor => {
        const testInfo = TestMetadata.getTestInfo(compConstructor);
        if (testInfo && this.testMode.includes(testInfo.mode)) {
          suiteComps.push({ info: testInfo, comp: compConstructor });
        }
      });

    return suiteComps;
  }

  getSuiteOverrides(suiteComp: ClassConstructor, container: Container): IComponentOverride[] {
    const suiteMocks = TestMetadata.getMocks(suiteComp);

    return suiteMocks.map(mock => {
      let mockInstance;
      
      try {
        mockInstance = container.get(mock);
      }
      catch(e) {
        throw new Error(`${mock.name || mock} is not a valid testing mock, on the testing suite ${suiteComp.name}!`);
      }
   
      const mockedComp = TestMetadata.getMockInfo(mock);
      
      if (!mockedComp || !mockInstance) {
        throw new Error(`${mock.name || mock} is not a valid testing mock, on the testing suite ${suiteComp.name}!`);
      }

      return {
        component: mockedComp,
        use: mockInstance
      } as IComponentOverride;
    });
  }

  applyOverrides(overrides: IComponentOverride[], container: Container) {
    overrides.forEach(override => {
      container.rebind(override.component).toConstantValue(override.use);
    });
  }

  private getCases(compConstructor: ClassConstructor, compInstance: any) {
    return TestMetadata.getCases(compConstructor)
      .map(testCase => {
        return {
          title: testCase.title,
          fn: testCase.active ? compInstance[testCase.method].bind(compInstance, testCase.params) : undefined
        };
      });
  }

  private getBeforeAll(compConstructor: ClassConstructor, compInstance: any): TestHook[] {
    return TestMetadata.getBeforeAll(compConstructor)
      .map(beforeAll => {
        return {
          title: beforeAll.title,
          fn: compInstance[beforeAll.method].bind(compInstance)
        };
      });
  }

  private getAfterAll(compConstructor: ClassConstructor, compInstance: any): TestHook[] {
    return TestMetadata.getAfterAll(compConstructor)
      .map(afterAll => {
        return {
          title: afterAll.title,
          fn: compInstance[afterAll.method].bind(compInstance)
        };
      });
  }

  private getBeforeEach(compConstructor: ClassConstructor, compInstance: any): TestHook[] {
    return TestMetadata.getBeforeEach(compConstructor)
      .map(beforeEach => {
        return {
          title: beforeEach.title,
          fn: compInstance[beforeEach.method].bind(compInstance)
        };
      });
  }

  private getAfterEach(compConstructor: ClassConstructor, compInstance: any): TestHook[] {
    return TestMetadata.getAfterEach(compConstructor)
      .map(afterEach => {
        return {
          title: afterEach.title,
          fn: compInstance[afterEach.method].bind(compInstance)
        };
      });
  }
}