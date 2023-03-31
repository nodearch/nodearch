import { CoreAnnotation } from '../../registry/enums.js';
import { IComponentOptions } from '../../registry/interfaces.js';
import { ComponentFactory } from '../../registry/factory.js';


export const Config = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreAnnotation.Config, options });