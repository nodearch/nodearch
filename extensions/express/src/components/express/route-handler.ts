import express from 'express';
import { Service } from '@nodearch/core';
import { ErrorRegistry } from '../errors/error-registry';
import { InternalServerError } from '../errors/http-errors';
import { RouteHandlerParam } from './enums';
import { IExpressRouteHandlerInput } from './interfaces';


@Service()
export class RouteHandler {

  constructor(
    private readonly errorRegistry: ErrorRegistry
  ) { }

  create(controllerMethodName: string, inputs: IExpressRouteHandlerInput[]): express.Handler {
    return (req, res) => {
      const params = this.getHandlerParams(req, res, inputs);

      const handler = req.nodearch.controller[controllerMethodName];

      handler(...params)
        .then((result: any) => {

          if (res.headersSent) return;

          if (result) return res.send(result); // TODO: we need to check that result is not number

          const errorMsg = `A route handler was called, but no response was returned.
            Controller: ${req.nodearch.controller.constructor.name}
            Method: ${controllerMethodName}`;

          this.errorRegistry.handleError(new InternalServerError(errorMsg), res);
        })
        .catch((err: any) => {
          this.errorRegistry.handleError(err, res);
        });

    };
  }

  private getHandlerParams(req: express.Request, res: express.Response, inputs: IExpressRouteHandlerInput[]) {
    return inputs
      .sort((a, b) => a.index - b.index)
      .map(input => {
        let param;

        switch (input.type) {
          case RouteHandlerParam.REQ:
            param = req;
            break;
          case RouteHandlerParam.RES:
            param = res;
            break;
          case RouteHandlerParam.BODY:
            param = input.key ? req.body[input.key] : req.body;
            break;
          case RouteHandlerParam.HEADERS:
            param = input.key ? req.headers[input.key] : req.headers;
            break;
          case RouteHandlerParam.PARAMS:
            param = input.key ? req.params[input.key] : req.params;
            break;
          case RouteHandlerParam.QUERY:
            param = input.key ? req.query[input.key] : req.query;
            break;
        }

        return param;
      });
  }
}