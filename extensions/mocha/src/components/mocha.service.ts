import { ClassConstructor, ComponentInfo, Container, Service } from '@nodearch/core';
import { ITestCaseOptions, ITestRunnerSuite, ITestSuiteMetadata, ITestSuiteOptions, TestHook } from '../interfaces';
import { TestBox } from '../test-box';
import { MochaAnnotation } from '../enums';
import Mocha, { Test } from 'mocha';


@Service()
export class MochaService {
  
  private suites: ITestRunnerSuite[];

  constructor() {
    this.suites = [];
  }

  init(container: Container, testComponents: ComponentInfo[], mockComponents?: ComponentInfo[]) {

    testComponents.forEach(componentInfo => {

      // Create a clone from the original container
      const cloneContainer = Container.merge(container, new Container()) as Container;

      // Bind an instance of the TestBox to the cloned container
      cloneContainer.bind(TestBox).toConstantValue(new TestBox(cloneContainer));

      if (mockComponents) {
        this.applyMocks(componentInfo, mockComponents, cloneContainer);
      }

      const compInstance = cloneContainer.get(componentInfo.getClass());

      const data: ITestSuiteOptions = componentInfo.data;

      this.suites.push({
        name: data.title as string,
        timeout: data.timeout,
        beforeEach: this.getBeforeEach(componentInfo, compInstance),
        afterEach: this.getAfterEach(componentInfo, compInstance),
        beforeAll: this.getBeforeAll(componentInfo, compInstance),
        afterAll: this.getAfterAll(componentInfo, compInstance),
        testCases: this.getCases(componentInfo, compInstance)
      });

    });

  }

  async run() {
    // TODO: pass mocha options
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

    const code = await this.runMocha(mochaInstance);

    process.exit(code);
  }

  private async runMocha (mochaInstance: Mocha): Promise<number> {
    return new Promise((resolve, reject) => {
      mochaInstance.run((failures) => {
        resolve(failures);
      });
    });
  }

  private applyMocks(testComponentInfo: ComponentInfo, mockComponents: ComponentInfo[], container: Container) {
    testComponentInfo.getDecoratorsById<{ component: ClassConstructor }>(MochaAnnotation.UseMock)
      .forEach(({ data }) => {

        const mockComp = mockComponents
          .find(
            comp => comp.getClass() === data!.component
          ) as ComponentInfo<{ component: ClassConstructor }>;

        const mockInstance = container.get(mockComp.getClass());

        container.rebind(mockComp.data!.component).toConstantValue(mockInstance);

      });
  }

  private getCases(componentInfo: ComponentInfo, compInstance: any) {
    return componentInfo.getDecoratorsById(MochaAnnotation.Case)
      .map(({method, data}) => {
        const { title, active, params } = data as Required<ITestCaseOptions>;
        return {
          title,
          fn: active ? compInstance[method as string].bind(compInstance, params) : undefined
        };
      })
      .reverse();
  }

  private getBeforeAll(componentInfo: ComponentInfo, compInstance: any): TestHook[] {
    return componentInfo.getDecoratorsById(MochaAnnotation.BeforeAll)
      .map(({method, data}) => {
        const { title } = data as { title: string };
        return {
          title,
          fn: compInstance[method as string].bind(compInstance)
        };
      })
      .reverse();
  }

  private getAfterAll(componentInfo: ComponentInfo, compInstance: any): TestHook[] {
    return componentInfo.getDecoratorsById(MochaAnnotation.AfterAll)
      .map(({method, data}) => {
        const { title } = data as { title: string };
        return {
          title,
          fn: compInstance[method as string].bind(compInstance)
        };
      })
      .reverse();
  }

  private getBeforeEach(componentInfo: ComponentInfo, compInstance: any): TestHook[] {
    return componentInfo.getDecoratorsById(MochaAnnotation.BeforeEach)
      .map(({method, data}) => {
        const { title } = data as { title: string };
        return {
          title,
          fn: compInstance[method as string].bind(compInstance)
        };
      })
      .reverse();
  }

  private getAfterEach(componentInfo: ComponentInfo, compInstance: any): TestHook[] {
    return componentInfo.getDecoratorsById(MochaAnnotation.AfterEach)
      .map(({method, data}) => {
        const { title } = data as { title: string };
        return {
          title,
          fn: compInstance[method as string].bind(compInstance)
        };
      })
      .reverse();
  }
}