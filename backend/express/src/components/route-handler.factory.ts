import { DependencyException, Logger, Service } from '@nodearch/core';
import express from 'express';
import { IHttpControllerMethod, IHTTPMethodParamInfo, IMiddlewareMetadataInfo } from '../interfaces';
import { RouteHandlerParam } from '../enums';
import { HttpErrorsRegistry } from './errors-registry.service';
import { MiddlewareService } from './middleware.service';
import { InternalServerError } from '../http-errors';

@Service()
export class RouteHandlerFactory {

  constructor(
    private readonly httpErrorsRegistry: HttpErrorsRegistry, 
    private readonly middlewareService: MiddlewareService
  ) { }

  createHandler(controller: any, methodInfo: IHttpControllerMethod, middlewareInfo: IMiddlewareMetadataInfo[], dependencyFactory: (x: any) => any) {
    return async (req: express.Request, res: express.Response) => {

      try {
        const params: IHTTPMethodParamInfo[] = [];
        const controllerInstance = dependencyFactory(controller);
        await this.middlewareService.getMiddlewareHandler(middlewareInfo, controllerInstance)(req, res);

        methodInfo.params.forEach(param => {
          params[param.index] = this.getParam(req, res, param);
        });

        const result = await controllerInstance[methodInfo.name](...params);

        if (result && !res.headersSent) {
          res.send(result); // TODO: we need to check that result is not number
        }
        // TODO: handle when the handler doesn't return anything
      }
      catch (e) {
        if (e instanceof DependencyException) {
          // TODO: enhance how we log errors, currently it will not print all the information
          // this.logger.error(e);
          console.log(e);
          this.httpErrorsRegistry.handleError(new InternalServerError(), res);
        }
        else {
          this.httpErrorsRegistry.handleError(e, res);
        }
      }
    }
  }

  private getParam(req: express.Request, res: express.Response, paramInfo: IHTTPMethodParamInfo) {
    let param;

    switch (paramInfo.type) {
      case RouteHandlerParam.REQ:
        param = req;
        break;
      case RouteHandlerParam.RES:
        param = res;
        break;
      case RouteHandlerParam.BODY:
        param = req.body;
        break;
      case RouteHandlerParam.HEADERS:
        param = paramInfo.key ? req.headers[paramInfo.key] : req.headers;
        break;
      case RouteHandlerParam.PARAMS:
        param = paramInfo.key ? req.params[paramInfo.key] : req.params;
        break;
      case RouteHandlerParam.QUERY:
        param = paramInfo.key ? req.query[paramInfo.key] : req.query;
        break;
    }

    return param;
  }
}