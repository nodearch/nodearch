import { ClassConstructor, ClassMethodDecorator, ComponentFactory, IComponentOptions } from '@nodearch/core';
import { ExpressAnnotationId } from '../express/enums';
import { MiddlewareHandler, ExpressMiddlewareHandler } from './interfaces';


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