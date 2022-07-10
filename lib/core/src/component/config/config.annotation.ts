import { CoreComponentId } from '../enums';
import { IComponentOptions } from "../interfaces";
import { ComponentFactory } from '../component-factory';


export const Config = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.decorator({ id: CoreComponentId.Config, options });