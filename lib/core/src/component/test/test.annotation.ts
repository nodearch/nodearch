import { ComponentScope, CoreComponentId } from '../enums';
import { TestMetadata } from './test.metadata';
import { ITestCaseMetadata, ITestCaseOptions, ITestSuiteMetadata, ITestSuiteOptions } from './test.interfaces';
import { ClassConstructor } from '../../utils';
import { camelToTitle } from '../../utils/utils';
import { TestMode } from './test.enums';
import { ComponentFactory } from '../component-factory';




export function Test(): ClassDecorator;
export function Test(title: string): ClassDecorator;
export function Test(options: ITestSuiteOptions): ClassDecorator;
export function Test(title: string, options: Omit<ITestSuiteOptions, 'title'>): ClassDecorator;
export function Test(...args: (string | ITestSuiteOptions | Omit<ITestSuiteOptions, 'title'>)[]): ClassDecorator {
  return ComponentFactory.decorator({ 
    id: CoreComponentId.Test,
    options: {
      export: false,
      scope: ComponentScope.Singleton
    },
    fn(target) {
      
      let options: ITestSuiteMetadata = {
        mode: TestMode.UNIT,
        title: camelToTitle(<string>target.name),
        timeout: 2000
      };
  
      args.forEach(arg => {
        if (typeof arg === 'string') options.title = arg;
        else if (typeof arg === 'object') Object.assign(options, arg);
      });

      TestMetadata.setTestInfo(target, options);
    }
  });
}

// TODO: validate the input
export function Mock(component: ClassConstructor): ClassDecorator {
  return ComponentFactory.decorator({ 
    id: CoreComponentId.Mock, 
    options: {
      export: false,
      scope: ComponentScope.Transient
    },
    fn(target) {
      TestMetadata.setMockInfo(target, component);
    }
  });
}

// TODO: validate the input
export function UseMock(component: ClassConstructor): ClassDecorator {
  return function (target: any) {
    TestMetadata.setMock(target, component);
  }
}

export function BeforeAll(title?: string): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    TestMetadata.setBeforeAll(target.constructor, {
      method: <string>propKey,
      title
    });
  };
}

export function AfterAll(title?: string): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    TestMetadata.setAfterAll(target.constructor, {
      method: <string>propKey,
      title
    });
  };
}

export function BeforeEach(title?: string): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    TestMetadata.setBeforeEach(target.constructor, {
      method: <string>propKey,
      title
    });
  };
}

export function AfterEach(title?: string): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    TestMetadata.setAfterEach(target.constructor, {
      method: <string>propKey,
      title
    });
  };
}

export function Case(): MethodDecorator;
export function Case(title: string): MethodDecorator;
export function Case(options: ITestCaseOptions): MethodDecorator;
export function Case(title: string, options: Omit<ITestCaseOptions, 'title'>): MethodDecorator;
export function Case(...args: (string | ITestCaseOptions | Omit<ITestCaseOptions, 'title'>)[]): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    let options: ITestCaseMetadata = {
      method: <string>propKey,
      title: camelToTitle(<string>propKey),
      active: true,
      params: {}
    };

    args.forEach(arg => {
      if (typeof arg === 'string') options.title = arg;
      else if (typeof arg === 'object') Object.assign(options, arg);
    });

    TestMetadata.setCase(target.constructor, options);
  };
}