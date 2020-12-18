import { Service } from '@nodearch/core';
import express from 'express';
import { IHttpControllerMethod, IHTTPMethodParamInfo } from '../interfaces';
import { HTTPParam } from '../enums';
import { HttpErrorsRegistry } from './errors-registry.service';

@Service()
export class RouteHandlerFactory {

  constructor(private readonly httpErrorsRegistry: HttpErrorsRegistry) {}

  createHandler(controller: any, methodInfo: IHttpControllerMethod, dependencyFactory: (x: any) => any) {
    return async (req: express.Request, res: express.Response) => {
      const params: any = [];

      methodInfo.params.forEach(param => {
        params[param.index] = this.getParam(req, res, param);
      });

      try {
        const result = await dependencyFactory(controller)[methodInfo.name](...params);

        if (result && !res.headersSent) {
          res.send(result);
        }
      }
      catch(e) {
        this.httpErrorsRegistry.handleError(e, res);
      }
    }
  }

  private getParam(req: express.Request, res: express.Response, paramInfo: IHTTPMethodParamInfo) {
    let param;

    switch(paramInfo.type) {
      case HTTPParam.REQ:
        param = req;
        break;
      case HTTPParam.RES:
        param = res;
        break;
      case HTTPParam.BODY:
        param = req.body;
        break;
      case HTTPParam.HEADERS:
        param = req.headers[<string>paramInfo.key];
        break;
      case HTTPParam.PARAMS:
        param = req.params[<string>paramInfo.key];
        break;
      case HTTPParam.QUERY:
        param = req.query[<string>paramInfo.key];
        break;
    }

    return param;
  }
}