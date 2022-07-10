import { ControllerMetadata } from '../metadata';
import { ContextMiddlewareHandler, MiddlewareHandler } from '../types';
import { ClassInfo, ClassMethodDecorator, Component } from '@nodearch/core';
import { MiddlewareType } from '../enums';


export function MiddlewareProvider(): ClassDecorator{
  return function(target: any) {
    ControllerMetadata.setMiddlewareProvider(target);
    Component()(target);
  };
}

// TODO: rename to UseMiddleware
export function Middleware(middlewareHandler: MiddlewareHandler): ClassMethodDecorator;
export function Middleware(middlewareHandler: ContextMiddlewareHandler): ClassMethodDecorator;
export function Middleware<T>(middlewareHandler: ContextMiddlewareHandler<T>, options: T): ClassMethodDecorator;
export function Middleware(handler: MiddlewareHandler | ContextMiddlewareHandler, options?: any): ClassMethodDecorator {
  return function(target: any, propertyKey?: string) {
    const decoratorTarget = propertyKey ? target.constructor : target;
    let type = MiddlewareType.EXPRESS;
    const id = ControllerMetadata.getMiddleware(decoratorTarget).length;

    if (ControllerMetadata.isMiddlewareProvider(handler)) {
      ClassInfo.propertyInject(decoratorTarget, <ContextMiddlewareHandler>handler, 'middleware:' + id);
      type = MiddlewareType.CONTEXT;
    }

    ControllerMetadata.setMiddleware(decoratorTarget, {
      middleware: handler,
      method: propertyKey,
      options,
      type,
      id
    });
  };
}