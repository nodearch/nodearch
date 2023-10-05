import { Service } from '@nodearch/core';
import { ErrorRegistry } from '../errors/error-registry.js';
import { IExpressMiddlewareHandler, IMiddlewareInfo, IMiddleware } from './interfaces.js';
import { ComponentInfo } from '@nodearch/core/components';


@Service()
export class MiddlewareFactory {

  constructor(
    private readonly errorRegistry: ErrorRegistry
  ) {}

  createExpressMiddleware(middlewareInfo: IMiddlewareInfo[]) {
    return middlewareInfo.map(mw => {
      return this.createMiddlewareHandler(mw);
    });
  }

  defaultRouterMiddleware(componentInfo: ComponentInfo): IExpressMiddlewareHandler {
    return (req, res, next) => {
      req.nodearch = {
        controller: componentInfo.getInstance()
      };
      next();
    };
  }

  private createMiddlewareHandler(middlewareInfo: IMiddlewareInfo): IExpressMiddlewareHandler {
    return (req, res, next) => {

      const middlewareHandler = req.nodearch.controller[middlewareInfo.dependencyKey!] as IMiddleware;

      middlewareHandler
        .handler({
          args: {req, res},
          options: middlewareInfo.options
        })
        .then(() => next())
        .catch((err: any) => {
          this.errorRegistry.handleError(err, res);
        });
    };
  }
}