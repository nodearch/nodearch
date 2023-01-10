import { Container } from 'inversify';
import { ClassConstructor } from '../../../utils/types.js';
import { ComponentInfo } from '../../registration/info.js';
import { TestBox } from './test-box.js';
import { MochaAnnotation, TestMode } from './test.enums.js';
import { ITestCaseOptions, ITestSuiteOptions, TestHook } from './test.interfaces.js';



export class TestManager {
  
  private container: Container;

  constructor(container: Container) {
    this.container = container;
  }
  
  getTestSuitesInfo(testModes: TestMode[], testComponents: ComponentInfo<ITestSuiteOptions>[], mockComponents?: ComponentInfo[]) {
    return testComponents
      .filter((componentInfo) => testModes.includes(componentInfo.data!.mode as TestMode))
      .map(componentInfo => {

        // Create a clone from the original container
        const cloneContainer = Container.merge(this.container, new Container()) as Container;

        // Bind an instance of the TestBox to the cloned container
        cloneContainer.bind(TestBox).toConstantValue(new TestBox(cloneContainer));

        if (mockComponents) {
          this.applyMocks(componentInfo, mockComponents, cloneContainer);
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