import { AppContext, Service } from '@nodearch/core';
import { ExpressConfig } from '../express/express.config.js';
import express from 'express';
import { IValidationProvider } from './interfaces.js';
import { ClassConstructor } from '@nodearch/core/utils';
import { BadRequest } from '../errors/http-errors.js';
import { ErrorRegistry } from '../errors/error-registry.js';


@Service()
export class ValidationHandler {

  private provider?: IValidationProvider;

  constructor(
    private readonly expressConfig: ExpressConfig,
    private readonly appContext: AppContext,
    private readonly errorRegistry: ErrorRegistry
  ) {
    if (this.expressConfig.validation) {
      this.provider = this.appContext
        .container.get<IValidationProvider>(this.expressConfig.validation.provider);
    }
  }

  getHandler(component: ClassConstructor, method: string) {
    const provider = this.provider;

    if (!provider) return;

    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      provider
        .validate(component, method, {
          headers: req.headers,
          params: req.params,
          query: req.query,
          body: req.body
        })
        .then((validationResponse) => {
          if (validationResponse.result) {
            req.headers = validationResponse.headers || req.headers;
            req.params = validationResponse.params || req.params;
            req.query = validationResponse.query || req.query;
            req.body = validationResponse.body || req.body;
            next();
          }
          else {
            const customError = new BadRequest(validationResponse.message, validationResponse.details);
            this.errorRegistry.handleError(customError, res);
          }
        })
        .catch(err => {
          // This shouldn't happen but just in case.
          this.errorRegistry.handleError(err, res);
        });
    };
  }
}