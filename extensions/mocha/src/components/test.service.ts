import { App, AppContext, ComponentInfo, Container, Service } from '@nodearch/core';
import { ClassConstructor } from '@nodearch/core/utils';
import { TestBox } from '../test-box.js';
import { MochaAnnotation, TestMode } from '../annotation/test.enums.js';
import { ITestCaseOptions, ITestSuiteOptions, TestHook } from '../annotation/test.interfaces.js';
import { FileLoader } from '@nodearch/core/fs';


@Service()
export class TestService {
  
  constructor(
    private readonly appContext: AppContext
  ) {}
  
  async getTestSuitesInfo(testModes: TestMode[]) {
    // TODO: use AppLoader instead
    const MainApp: any = (await FileLoader.importModule(this.appContext.appInfo.paths.app)).default;

    const app: App = new MainApp();
    await app.init({
      mode: 'app',
      appInfo: this.appContext.appInfo
    });
    
    if (testModes.includes(TestMode.E2E)) {
      // TODO: move this after the test suite setup
      await app.start();
    }

    const testComponents = app.components.getComponents<ITestSuiteOptions>(MochaAnnotation.Test);
    const mockComponents = app.components.getComponents(MochaAnnotation.Mock);

    const suiteInfo = testComponents
      .filter((componentInfo) => {
        return testModes.includes(componentInfo.data!.mode as TestMode);
      })
      .map(componentInfo => {

        // Create a clone from the original container
        const cloneContainer = app.container.clone();

        // Bind an instance of the TestBox to the cloned container
        cloneContainer.bindToConstant(TestBox, new TestBox(cloneContainer));

        this.applyMocks(componentInfo, mockComponents, cloneContainer);

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

    return suiteInfo;
  }

  private applyMocks(testComponentInfo: ComponentInfo, mockComponents: ComponentInfo[], container: Container) {
    testComponentInfo.getDecoratorsById<{ component: ClassConstructor }>(MochaAnnotation.UseMock)
      .forEach(({ data }) => {

        const mockComp = mockComponents
          .find(
            comp => comp.getClass() === data!.component
          ) as ComponentInfo<{ component: ClassConstructor }>;

        const mockInstance = container.get(mockComp.getClass());

        container.override(mockComp.data!.component, mockInstance);

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