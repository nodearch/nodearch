import { ComponentFactory } from '../component-factory';
import { CoreComponentId } from '../enums';
import { IComponentOptions } from '../interfaces';
import { ControllerHandler } from './controller.handler';


export const Controller = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.decorator({ id: CoreComponentId.Controller, handler: ControllerHandler, options});