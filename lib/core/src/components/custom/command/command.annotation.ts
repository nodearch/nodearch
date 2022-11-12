import { CoreAnnotation } from '../../enums';
import { IComponentOptions } from "../../interfaces";
import { ComponentFactory } from '../../registration';


export const Command = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreAnnotation.Command, options });