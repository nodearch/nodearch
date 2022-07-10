import { ComponentMetadata } from '../component.metadata';
import { ComponentType } from '../enums';
import { injectable } from 'inversify';
import { IComponentInfo, IComponentOptions } from "../interfaces";

export function Cli(options?: IComponentOptions): ClassDecorator {  
  return function (target: any) {
    ComponentMetadata.setInfo<IComponentInfo>(target, {
      ...options,
      type: ComponentType.Cli
    });
    injectable()(target);
  }
}

export const DECORATOR_ID_COMPONENT = '@nodearch/core/cli';

export const Component = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.decorator(DECORATOR_ID_COMPONENT, options);