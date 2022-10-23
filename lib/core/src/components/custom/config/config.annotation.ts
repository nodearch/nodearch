import { CoreAnnotation } from '../../enums';
import { IComponentOptions } from '../../interfaces';
import { ComponentFactory } from '../../registration';


export const Config = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreAnnotation.Config, options });