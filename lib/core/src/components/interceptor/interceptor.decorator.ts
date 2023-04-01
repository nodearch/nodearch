import { componentDecorator } from '../decorator-factory.js';
import { CoreDecorator } from '../enums.js';
import { IComponentOptions } from '../interfaces.js';



export const Interceptor = (options?: IComponentOptions): ClassDecorator => 
  componentDecorator({ id: CoreDecorator.INTERCEPTOR, options});