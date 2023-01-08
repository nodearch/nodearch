import { CoreAnnotation } from '../../enums.js';
import { IComponentOptions } from '../../interfaces.js';
import { ComponentFactory } from '../../registration/factory.js';


export const Service = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreAnnotation.Service, options });