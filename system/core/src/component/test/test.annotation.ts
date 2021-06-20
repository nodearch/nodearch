import {ComponentMetadata} from '../component.metadata';
import {ComponentType} from '../enums';
import {injectable} from 'inversify';
import {IComponentInfo, IComponentOptions} from "../interfaces";


export function Test(options?: IComponentOptions): ClassDecorator {
  return function (target: any) {
    ComponentMetadata.setInfo<IComponentInfo>(target, {
      ...options,
      type: ComponentType.Test
    });
    injectable()(target);
  }
}

export function TestCase(): MethodDecorator {
  return () => {};
}

export function Before(): MethodDecorator {
  return () => {};
}

export function After(): MethodDecorator {
  return () => {};
}

export function BeforeEach(): MethodDecorator {
  return () => {};
}

export function AfterEach(): MethodDecorator {
  return () => {};
}