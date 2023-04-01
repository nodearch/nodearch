import { componentDecorator } from '../decorator-factory.js';
import { CoreDecorator } from '../enums.js';
import { IComponentOptions } from '../interfaces.js';

export const Component = (options?: IComponentOptions): ClassDecorator => 
  componentDecorator({ id: CoreDecorator.COMPONENT, options });