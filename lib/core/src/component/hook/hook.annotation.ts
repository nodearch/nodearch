import { ComponentFactory } from '../component-factory';
import { CoreComponentId } from '../enums';
import { IComponentOptions } from '../interfaces';


export const Hook = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreComponentId.Hook, options });