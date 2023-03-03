import { ComponentInfo, Service } from '@nodearch/core';
import { ErrorRegistry } from '../errors/error-registry.js';
import { ExpressMiddlewareHandler, IMiddlewareInfo, MiddlewareProvider } from './interfaces.js';


@Service()
export class MiddlewareFactory {

  constructor(
    private readonly errorRegistry: ErrorRegistry
  ) {}

  createExpressMiddleware(middlewareInfo: IMiddlewareInfo[]) {
    return middlewareInfo.map(mw => {

      let middlewareHandler;

      if (mw.isExpressMiddleware) {
        middlewareHandler = mw.handler as ExpressMiddlewareHandler;
      }
      else {
        middlewareHandler = this.createMiddlewareHandler(mw);
      }

      return middlewareHandler;
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