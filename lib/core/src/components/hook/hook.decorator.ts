import { componentDecorator } from '../decorator-factory.js';
import { CoreDecorator } from '../enums.js';
import { IComponentOptions } from '../interfaces.js';


export const Hook = (options?: IComponentOptions): ClassDecorator => 
  componentDecorator({ id: CoreDecorator.HOOK, options });