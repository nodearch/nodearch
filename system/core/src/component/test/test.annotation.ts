import {ComponentMetadata} from '../component.metadata';
import {ComponentScope, ComponentType} from '../enums';
import {injectable} from 'inversify';
import {IComponentInfo} from "../interfaces";
import { TestMetadata } from './test.metadata';
import { ITestCaseMetadata, ITestCaseOptions, ITestSuiteMetadata, ITestSuiteOptions } from './test.interfaces';
import { ClassConstructor } from '../../utils';
import { camelToTitle } from '../../utils/utils';
import { TestMode } from './test.enums';


export function Test(): ClassDecorator;
export function Test(title: string): ClassDecorator;
export function Test(options: ITestSuiteOptions): ClassDecorator;
export function Test(title: string, options: Omit<ITestSuiteOptions, 'title'>): ClassDecorator;
export function Test(...args: (string | ITestSuiteOptions | Omit<ITestSuiteOptions, 'title'>)[]): ClassDecorator {
  return function (target: any) {
    
    let options: ITestSuiteMetadata = {
      mode: TestMode.UNIT,
      title: camelToTitle(<string>target.name),
      timeout: 2000
    };

    args.forEach(arg => {
      if (typeof arg === 'string') options.title = arg;
      else if (typeof arg === 'object') Object.assign(options, arg);
    });


    ComponentMetadata.setInfo<IComponentInfo>(target, {
      export: false,
      scope: ComponentScope.Singleton,
      type: ComponentType.Test
    });
    
    TestMetadata.setTestInfo(target, options);

    injectable()(target);
  }
}

// TODO: validate the input
export function Mock(component: ClassConstructor): ClassDecorator {
  return function (target: Function) {
    ComponentMetadata.setInfo<IComponentInfo>(target, {
      export: false,
      scope: ComponentScope.Transient,
      type: ComponentType.Test
    });

    TestMetadata.setMockInfo(target, component);

    injectable()(target);
  }
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