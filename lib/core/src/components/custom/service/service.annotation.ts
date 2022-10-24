import { CoreAnnotation } from '../../enums';
import { IComponentOptions } from '../../interfaces';
import { ComponentFactory } from '../../registration';



export const Service = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreAnnotation.Service, options });