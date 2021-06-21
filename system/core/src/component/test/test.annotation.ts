import {ComponentMetadata} from '../component.metadata';
import {ComponentScope, ComponentType} from '../enums';
import {injectable} from 'inversify';
import {IComponentInfo, IComponentOptions} from "../interfaces";
import { TestMetadata } from './test.metadata';
import { ITestComponentOptions } from './test.interfaces';


export function Test(options: ITestComponentOptions): ClassDecorator {
  return function (target: any) {
    ComponentMetadata.setInfo<IComponentInfo>(target, {
      export: false,
      scope: ComponentScope.Singleton,
      type: ComponentType.Test
    });
    
    TestMetadata.setTestInfo(target, {
      title: options.title
    });

    injectable()(target);
  }
}

export function Before(title: string): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    TestMetadata.setBefore(target.constructor, {
      method: <string>propKey,
      title
    });
  };
}

export function After(title: string): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    TestMetadata.setAfter(target.constructor, {
      method: <string>propKey,
      title
    });
  };
}

export function BeforeEach(title: string): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    TestMetadata.setBeforeEach(target.constructor, {
      method: <string>propKey,
      title
    });
  };
}

export function AfterEach(title: string): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    TestMetadata.setAfterEach(target.constructor, {
      method: <string>propKey,
      title
    });
  };
}

export function TestCase(title: string): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    TestMetadata.setTestCase(target.constructor, {
      method: <string>propKey,
      title
    });
  };
}