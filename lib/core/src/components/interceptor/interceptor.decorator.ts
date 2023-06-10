import { ComponentFactory } from '../component-factory.js';
import { CoreDecorator } from '../enums.js';
import { IComponentOptions } from '../interfaces.js';



export const Interceptor = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreDecorator.INTERCEPTOR, options});