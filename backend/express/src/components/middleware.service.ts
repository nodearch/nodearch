import { Service } from '@nodearch/core';
import { ControllerMetadata } from '../metadata';
import { IMiddlewareMetadataInfo } from '../interfaces';
import { ContextMiddlewareHandler, MiddlewareHandler } from '../types';
import { HttpErrorsRegistry } from './errors-registry.service';
import express from 'express';

@Service()
export class MiddlewareService {

  constructor(private httpErrorsRegistry: HttpErrorsRegistry) {}

  getMiddlewares(controller: any) {
    return ControllerMetadata.getMiddlewares(controller);
  }

  getMethodMiddlewares(middlewaresInfo: IMiddlewareMetadataInfo[], methodName: string, dependencyFactory: (x: any) => any) {
    return middlewaresInfo.filter(middlewareInfo => {
      return middlewareInfo.method === methodName || !middlewareInfo.method;
    })
      .map(middlewareInfo => {
        if (ControllerMetadata.isMiddlewareProvider(middlewareInfo.middleware)) {
          return this.getMiddlewareHandler(<ContextMiddlewareHandler>middlewareInfo.middleware, dependencyFactory);
        }
        else {
          return <MiddlewareHandler>middlewareInfo.middleware;
        }
      })
      .reverse();
  }

  private getMiddlewareHandler(middlewareProvider: ContextMiddlewareHandler, dependencyFactory: (x: any) => any): MiddlewareHandler {
    // TODO: what if we couldn't resolve the provider, or it didn't have handler function
    const provider = dependencyFactory(middlewareProvider);
    
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      // provider.handler.bind(provider);
      provider.handler(req, res)
        .then(() => next())
        .catch((err: Error) => this.httpErrorsRegistry.handleError(err, res));
    };
  }
}