import { ClassMethodDecorator, ComponentFactory } from '@nodearch/core';
import { ExpressAnnotationId } from './enums';
import { MiddlewareHandler, ExpressMiddlewareHandler } from './interfaces';

export function Middleware(): ClassDecorator {
  return ComponentFactory.componentDecorator({ id: ExpressAnnotationId.Middleware });
}

// TODO: rename to UseMiddleware
export function UseMiddleware(middlewareHandler: ExpressMiddlewareHandler): ClassMethodDecorator;
export function UseMiddleware(middlewareHandler: MiddlewareHandler): ClassMethodDecorator;
export function UseMiddleware<T>(middlewareHandler: MiddlewareHandler<T>, options: T): ClassMethodDecorator;
export function UseMiddleware(handler: ExpressMiddlewareHandler | MiddlewareHandler, options?: any): ClassMethodDecorator {
  return ComponentFactory.classMethodDecorator({
    id: ExpressAnnotationId.UseMiddleware,
    fn(target, propKey?) {

      const isMiddleware = ComponentFactory.isComponent(handler, ExpressAnnotationId.Middleware);

      return {
        isMiddleware, 
        handler
      };
    },
  });
}