import { IComponentOptions } from '@nodearch/core';
import { ClassConstructor, ClassMethodDecorator } from '@nodearch/core/utils';
import { ExpressDecorator } from '../express/enums.js';
import { MiddlewareHandler, ExpressMiddlewareHandler } from './interfaces.js';
import { classMethodDecorator, componentDecorator, isComponent } from '@nodearch/core/decorators';


export function Middleware(options?: IComponentOptions): ClassDecorator {
  return componentDecorator({ id: ExpressDecorator.MIDDLEWARE, options });
}

export function Use(middlewareHandler: ExpressMiddlewareHandler): ClassMethodDecorator;
export function Use(middlewareHandler: MiddlewareHandler): ClassMethodDecorator;
export function Use<T>(middlewareHandler: MiddlewareHandler<T>, options: T): ClassMethodDecorator;
export function Use(handler: ExpressMiddlewareHandler | MiddlewareHandler, options?: any): ClassMethodDecorator {
  
  const isExpressMiddleware = !isComponent(handler, ExpressDecorator.MIDDLEWARE);

  const dependencies = isExpressMiddleware ? [] : [handler as ClassConstructor];

  return classMethodDecorator({
    id: ExpressDecorator.USE,
    fn() {
      return {
        isExpressMiddleware,
        handler,
        options
      };
    },
    dependencies
  });
}