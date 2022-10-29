import { ClassConstructor, ComponentInfo, Container, Service } from '@nodearch/core';
import { ITestCaseOptions, ITestRunnerSuite, ITestSuiteMetadata, ITestSuiteOptions, TestHook } from '../interfaces';
import { TestBox } from '../test-box';
import Mocha from 'mocha';
import { MochaAnnotation } from '../enums';


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
      });
  }

  private getBeforeAll(componentInfo: ComponentInfo, compInstance: any): TestHook[] {
    return componentInfo.getDecoratorsById(MochaAnnotation.BeforeAll)
      .map(({method, data}) => {
        const { title } = data as { title: string };
        return {
          title,
          fn: compInstance[method as string].bind(compInstance)
        };
      });
  }

  private getAfterAll(componentInfo: ComponentInfo, compInstance: any): TestHook[] {
    return componentInfo.getDecoratorsById(MochaAnnotation.AfterAll)
      .map(({method, data}) => {
        const { title } = data as { title: string };
        return {
          title,
          fn: compInstance[method as string].bind(compInstance)
        };
      });
  }

  private getBeforeEach(componentInfo: ComponentInfo, compInstance: any): TestHook[] {
    return componentInfo.getDecoratorsById(MochaAnnotation.BeforeEach)
      .map(({method, data}) => {
        const { title } = data as { title: string };
        return {
          title,
          fn: compInstance[method as string].bind(compInstance)
        };
      });
  }

  private getAfterEach(componentInfo: ComponentInfo, compInstance: any): TestHook[] {
    return componentInfo.getDecoratorsById(MochaAnnotation.AfterEach)
      .map(({method, data}) => {
        const { title } = data as { title: string };
        return {
          title,
          fn: compInstance[method as string].bind(compInstance)
        };
      });
  }
}