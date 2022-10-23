import { multiInject } from 'inversify';
import { CoreAnnotation } from './enums';
import { IComponentOptions } from './interfaces';
import { ComponentFactory } from './registration/factory';


export const Component = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreAnnotation.Component, options });

export function InjectNs(namespace: string): ParameterDecorator {
  return function (target: any, key: string | symbol, index: number) {
    multiInject(namespace)(target, <string>key, index);
  }
}