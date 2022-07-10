import { CoreComponentId } from '../enums';
import { IComponentOptions } from "../interfaces";
import { ComponentFactory } from '../component-factory';


export const Service = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.decorator({ id: CoreComponentId.Service, options });