import { CoreAnnotation } from '../../enums';
import { IComponentOptions } from '../../interfaces';
import { ComponentFactory } from '../../registration';



export const Repository = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreAnnotation.Repository, options });