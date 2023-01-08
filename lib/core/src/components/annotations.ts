import { multiInject } from 'inversify';
import { CoreAnnotation } from './enums.js';
import { IComponentOptions } from './interfaces.js';
import { ComponentFactory } from './registration/factory.js';


export const Component = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreAnnotation.Component, options });

export function InjectNs(namespace: string): ParameterDecorator {
  return function (target: any, key: string | symbol, index: number) {
    multiInject(namespace)(target, <string>key, index);
  }
}