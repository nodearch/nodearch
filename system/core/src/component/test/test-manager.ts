import { IComponentOverride, IMock, ITestRunner, ITestSuiteComponentMetadata, TestHook } from './test.interfaces';
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
    const suiteComps = this.getTestComponents();

    suiteComps.forEach(suite => {
      // Create a clone from the original container
      const container = Container.merge(this.container, new Container()) as Container;
      
      // Bind an instance of the TestBox to the cloned container
      container.bind(TestBox).toConstantValue(new TestBox(container));

      const mocks = this.getMockInfo(suite.comp, container);

      mocks.forEach(mock => {

        if (mock.override) {
          this.applyOverrides(mock.override, container);
        }

      });

      const compInstance = container.get(suite.comp);

      const mocksHooks = this.getMockHooks(mocks);

      this.testRunner.addSuite({
        name: suite.info.name,
        beforeAll: mocksHooks.beforeAll.concat(this.getBeforeAll(suite.comp, compInstance)),
        afterAll: mocksHooks.afterAll.concat(this.getAfterAll(suite.comp, compInstance)),
        beforeEach: mocksHooks.beforeEach.concat(this.getBeforeEach(suite.comp, compInstance)),
        afterEach: mocksHooks.afterEach.concat(this.getAfterEach(suite.comp, compInstance)),
        testCases: this.getCases(suite.comp, compInstance)
      });
    });
  }

  getTestComponents() {
    const suiteComps: { info: ITestSuiteComponentMetadata, comp: ClassConstructor }[] = [];

    this.testComponents
      .forEach(compConstructor => {
        const testInfo = TestMetadata.getTestInfo(compConstructor);
        if (!testInfo) throw new Error('Invalid component options: ' + compConstructor.name);
        
        if(testInfo.type === 'suite') {
          suiteComps.push({ info: testInfo, comp: compConstructor });
        }
      });

    return suiteComps;
  }

  getMockInfo(suiteComp: ClassConstructor, container: Container): IMock[] {
    const mocksMetadata = TestMetadata.getMocks(suiteComp);

    return mocksMetadata.map(mock => {
      return container.get<IMock>(mock.mockComponent);
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
          fn: testCase.active ? compInstance[testCase.method].bind(compInstance) : undefined
        };
      });
  }

  private getMockHooks(mocks: IMock[]) {
    const beforeAll: TestHook[] = [],
      afterAll: TestHook[] = [],
      beforeEach: TestHook[] = [],
      afterEach: TestHook[] = [];
  
    mocks.forEach(mock => {
      if (mock.beforeAll) {
        beforeAll.push({
          title: mock.beforeAll.name,
          fn: mock.beforeAll.bind(mock)
        });
      }
      else if (mock.afterAll) {
        afterAll.push({
          title: mock.afterAll.name,
          fn: mock.afterAll.bind(mock)
        });
      }
      else if (mock.beforeEach) {
        beforeEach.push({
          title: mock.beforeEach.name,
          fn: mock.beforeEach.bind(mock)
        });
      }
      else if (mock.afterEach) {
        afterEach.push({
          title: mock.afterEach.name,
          fn: mock.afterEach.bind(mock)
        });
      }
    });

    return {
      beforeAll,
      afterAll,
      beforeEach,
      afterEach
    };
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

  async run () {
    this.init();
    await this.testRunner.run();
  }
}