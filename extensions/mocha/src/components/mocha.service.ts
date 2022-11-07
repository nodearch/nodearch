import { ClassConstructor, ComponentInfo, Container, Service } from '@nodearch/core';
import { ITestCaseOptions, ITestSuiteOptions, TestHook } from '../interfaces';
import { TestBox } from '../test-box';
import { MochaAnnotation, TestMode } from '../enums';
import Mocha, { Test } from 'mocha';
import NYC from 'nyc';



@Service()
export class MochaService {
  
  private container!: Container;
  private testComponents!: ComponentInfo<ITestSuiteOptions>[];
  private mockComponents?: ComponentInfo[];


  init(container: Container, testComponents: ComponentInfo<ITestSuiteOptions>[], mockComponents?: ComponentInfo[]) {
    this.container = container;
    this.testComponents = testComponents;
    this.mockComponents = mockComponents;
  } 

  async run(modes: TestMode[], coverage?: any) {

    const suites = this.getTestSuitesInfo(modes);

    let nyc: NYC | undefined;

    if (coverage) {

      // for (const x in require.cache) {
      //   delete require.cache[x];
      // }

      nyc = new NYC(coverage);
      await nyc.reset();
      await nyc.wrap();
      await nyc.addAllFiles();      
    }

    // TODO: pass mocha options
    const mochaInstance = new Mocha({});

    suites.forEach(suite => {
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

    if (nyc) {
      console.log(nyc);
      await nyc.writeCoverageFile();
      await nyc.report();
    }

    process.exit(code);
  }

  private async runMocha (mochaInstance: Mocha): Promise<number> {
    return new Promise((resolve, reject) => {
      mochaInstance.run((failures) => {
        resolve(failures);
      });
    });
  }
  
  private getTestSuitesInfo(testModes: TestMode[]) {
    return this.testComponents
      .filter((componentInfo) => testModes.includes(componentInfo.data!.mode as TestMode))
      .map(componentInfo => {

        // Create a clone from the original container
        const cloneContainer = Container.merge(this.container, new Container()) as Container;

        // Bind an instance of the TestBox to the cloned container
        cloneContainer.bind(TestBox).toConstantValue(new TestBox(cloneContainer));

        if (this.mockComponents) {
          this.applyMocks(componentInfo, this.mockComponents, cloneContainer);
        }

        const compInstance = cloneContainer.get(componentInfo.getClass());

        const suiteOptions = componentInfo.data as ITestSuiteOptions;

        return {
          name: suiteOptions.title as string,
          timeout: suiteOptions.timeout,
          beforeEach: this.getBeforeEach(componentInfo, compInstance),
          afterEach: this.getAfterEach(componentInfo, compInstance),
          beforeAll: this.getBeforeAll(componentInfo, compInstance),
          afterAll: this.getAfterAll(componentInfo, compInstance),
          testCases: this.getCases(componentInfo, compInstance)
        };

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