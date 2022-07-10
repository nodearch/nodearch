import { IComponentOptions } from '../interfaces';
import { ComponentFactory } from '../component-factory';
import { CoreComponentId } from '../enums';


export const Component = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.decorator(CoreComponentId.Component, options);