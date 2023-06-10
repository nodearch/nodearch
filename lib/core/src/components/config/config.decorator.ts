import { ComponentFactory } from '../component-factory.js';
import { CoreDecorator } from '../enums.js';
import { IComponentOptions } from '../interfaces.js';


export const Config = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreDecorator.CONFIG, options });