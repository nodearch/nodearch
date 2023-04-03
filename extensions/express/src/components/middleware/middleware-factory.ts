import { Service } from '@nodearch/core';
import { ErrorRegistry } from '../errors/error-registry.js';
import { ExpressMiddlewareHandler, IMiddlewareInfo, MiddlewareProvider } from './interfaces.js';
import { ComponentInfo } from '@nodearch/core/decorators';


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

  defaultRouterMiddleware(componentInfo: ComponentInfo): ExpressMiddlewareHandler {
    return (req, res, next) => {
      req.nodearch = {
        controller: componentInfo.getInstance()
      };
      next();
    };
  }

  private createMiddlewareHandler(middlewareInfo: IMiddlewareInfo): ExpressMiddlewareHandler {
    return (req, res, next) => {

      const middlewareHandler = req.nodearch.controller[middlewareInfo.dependencyKey!] as MiddlewareProvider<any>;

      middlewareHandler
        .handler(req, res, middlewareInfo.options)
        .then(() => next())
        .catch((err: any) => {
          this.errorRegistry.handleError(err, res);
        });
    };
  }
}