import { ComponentFactory } from '../component-factory';
import { CoreComponentId } from '../enums';
import { IComponentOptions } from '../interfaces';


export const Repository = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreComponentId.Repository, options });