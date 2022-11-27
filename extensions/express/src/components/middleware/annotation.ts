import { ClassConstructor, ClassMethodDecorator, ComponentFactory } from '@nodearch/core';
import { ExpressAnnotationId } from '../express/enums';
import { MiddlewareHandler, ExpressMiddlewareHandler } from './interfaces';


export function Middleware(): ClassDecorator {
  return ComponentFactory.componentDecorator({ id: ExpressAnnotationId.Middleware });
}

export function UseMiddleware(middlewareHandler: ExpressMiddlewareHandler): ClassMethodDecorator;
export function UseMiddleware(middlewareHandler: MiddlewareHandler): ClassMethodDecorator;
export function UseMiddleware<T>(middlewareHandler: MiddlewareHandler<T>, options: T): ClassMethodDecorator;
export function UseMiddleware(handler: ExpressMiddlewareHandler | MiddlewareHandler, options?: any): ClassMethodDecorator {
  
  const isExpressMiddleware = !ComponentFactory.isComponent(handler, ExpressAnnotationId.Middleware);

  const dependencies = isExpressMiddleware ? [] : [handler as ClassConstructor];

  return ComponentFactory.classMethodDecorator({
    id: ExpressAnnotationId.UseMiddleware,
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