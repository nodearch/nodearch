import { componentDecorator } from '../decorator-factory.js';
import { CoreDecorator } from '../enums.js';
import { IComponentOptions } from '../interfaces.js';


export const Repository = (options?: IComponentOptions): ClassDecorator => 
  componentDecorator({ id: CoreDecorator.REPOSITORY, options });