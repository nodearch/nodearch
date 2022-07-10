import { ComponentFactory } from '../component-factory';
import { CoreComponentId } from '../enums';
import { IComponentOptions } from '../interfaces';


export const Hook = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.decorator({ id: CoreComponentId.Hook, options });