import { ComponentFactory, IComponentOptions } from '@nodearch/core';
import { ClassConstructor, ClassMethodDecorator } from '@nodearch/core/utils';
import { ExpressAnnotationId } from '../express/enums.js';
import { MiddlewareHandler, ExpressMiddlewareHandler } from './interfaces.js';


export function Middleware(options?: IComponentOptions): ClassDecorator {
  return ComponentFactory.componentDecorator({ id: ExpressAnnotationId.Middleware, options });
}

export function Use(middlewareHandler: ExpressMiddlewareHandler): ClassMethodDecorator;
export function Use(middlewareHandler: MiddlewareHandler): ClassMethodDecorator;
export function Use<T>(middlewareHandler: MiddlewareHandler<T>, options: T): ClassMethodDecorator;
export function Use(handler: ExpressMiddlewareHandler | MiddlewareHandler, options?: any): ClassMethodDecorator {
  
  const isExpressMiddleware = !ComponentFactory.isComponent(handler, ExpressAnnotationId.Middleware);

  const dependencies = isExpressMiddleware ? [] : [handler as ClassConstructor];

  return ComponentFactory.classMethodDecorator({
    id: ExpressAnnotationId.Use,
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