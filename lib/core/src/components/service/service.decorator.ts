import { ComponentFactory } from '../component-factory.js';
import { CoreDecorator } from '../enums.js';
import { IComponentOptions } from '../interfaces.js';


export const Service = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreDecorator.SERVICE, options });