import { IComponentOptions } from '@nodearch/core';
import { ExpressDecorator } from '../express/enums.js';
import { ComponentFactory } from '@nodearch/core/components';


export function Middleware(options?: IComponentOptions): ClassDecorator {
  return ComponentFactory.componentDecorator({ id: ExpressDecorator.MIDDLEWARE, options });
}