import { CoreComponentId } from '../enums';
import { IComponentOptions } from "../interfaces";
import { ComponentFactory } from '../component-factory';


export const Cli = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.decorator({ id: CoreComponentId.Cli, options });