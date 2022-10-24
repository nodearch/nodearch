import { CoreAnnotation } from '../../enums';
import { IComponentOptions } from "../../interfaces";
import { ComponentFactory } from '../../registration';


export const Cli = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreAnnotation.Cli, options });