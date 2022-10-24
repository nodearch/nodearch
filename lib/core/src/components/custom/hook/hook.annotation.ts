import { CoreAnnotation } from '../../enums';
import { IComponentOptions } from '../../interfaces';
import { ComponentFactory } from '../../registration';



export const Hook = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreAnnotation.Hook, options });