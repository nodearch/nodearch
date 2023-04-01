
import { componentDecorator } from '../decorator-factory.js';
import { CoreDecorator } from '../enums.js';
import { IComponentOptions } from '../interfaces.js';

export const Controller = (options?: IComponentOptions): ClassDecorator => 
  componentDecorator({ id: CoreDecorator.CONTROLLER, options});