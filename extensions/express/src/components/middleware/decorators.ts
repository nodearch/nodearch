import { IComponentOptions } from '@nodearch/core';
import { ExpressDecorator } from '../express/enums.js';
import { componentDecorator } from '@nodearch/core/components';


export function Middleware(options?: IComponentOptions): ClassDecorator {
  return componentDecorator({ id: ExpressDecorator.MIDDLEWARE, options });
}