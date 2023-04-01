import { componentDecorator } from '../decorator-factory.js';
import { CoreDecorator } from '../enums.js';
import { IComponentOptions } from '../interfaces.js';


export const Config = (options?: IComponentOptions): ClassDecorator => 
  componentDecorator({ id: CoreDecorator.CONFIG, options });