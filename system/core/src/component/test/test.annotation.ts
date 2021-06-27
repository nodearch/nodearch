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

export function BeforeAll(title: string): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    TestMetadata.setBeforeAll(target.constructor, {
      method: <string>propKey,
      title
    });
  };
}

export function AfterAll(title: string): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    TestMetadata.setAfterAll(target.constructor, {
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

export function Case(title: string, active: boolean = true): MethodDecorator {
  return (target: any, propKey: string | symbol) => {
    TestMetadata.setCase(target.constructor, {
      method: <string>propKey,
      title,
      active
    });
  };
}