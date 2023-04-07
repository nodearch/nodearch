import { IComponentOptions } from '@nodearch/core';
import { ExpressDecorator } from '../express/enums.js';
import { componentDecorator } from '@nodearch/core/decorators';


export function Middleware(options?: IComponentOptions): ClassDecorator {
  return componentDecorator({ id: ExpressDecorator.MIDDLEWARE, options });
}