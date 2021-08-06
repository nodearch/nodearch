import {ComponentMetadata} from '../component.metadata';
import {ComponentScope, ComponentType} from '../enums';
import {injectable} from 'inversify';
import {IComponentInfo} from "../interfaces";
import { TestMetadata } from './test.metadata';
import { ITestSuiteOptions } from './test.interfaces';
import { ClassConstructor, ClassInfo } from '../../utils';
import { camelToTitle } from '../../utils/utils';


export function Test(options: ITestSuiteOptions): ClassDecorator {
  return function (target: any) {
    ComponentMetadata.setInfo<IComponentInfo>(target, {
      export: false,
      scope: ComponentScope.Singleton,
      type: ComponentType.Test
    });
    
    TestMetadata.setTestInfo(target, {
      type: 'suite',
      name: camelToTitle(<string>target.name),
      // name: typeof options === 'string' ? options : options.name
    });

    injectable()(target);
  }
}

export function Mock(): ClassDecorator {
  return function (target: any) {
    ComponentMetadata.setInfo<IComponentInfo>(target, {
      export: false,
      scope: ComponentScope.Transient,
      type: ComponentType.Test
    });

    TestMetadata.setTestInfo(target, {
      type: 'mock'
    });

    injectable()(target);
  }
}

export function UseMock(mockComponent: ClassConstructor): ClassDecorator {
  return function (target: any) {
    TestMetadata.setMock(target, {
      mockComponent
    });
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
export function Case(active: boolean): MethodDecorator;
export function Case(params: object): MethodDecorator;
export function Case(title: string, params: object): MethodDecorator;
export function Case(title: string, active: boolean): MethodDecorator;
export function Case(params: object, active: boolean): MethodDecorator;
export function Case(title: string, params: object, active: boolean): MethodDecorator;
export function Case(...args: (string | object | boolean)[]): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    let title: string = camelToTitle(<string>propKey),
    active: boolean = true,
    params: object | undefined = undefined;

    args.forEach(arg => {
      if (typeof arg === 'string') title = arg;
      else if (typeof arg === 'boolean') active = arg;
      else if (typeof arg === 'object') params = arg;
    });

    TestMetadata.setCase(target.constructor, {
      method: <string>propKey,
      title,
      active,
      params
    });
  };
}