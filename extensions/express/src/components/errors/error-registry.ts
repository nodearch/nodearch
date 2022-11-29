import express from 'express';
import { Logger, Service } from '@nodearch/core';
import { HttpError, InternalServerError } from './http-errors';
import { HttpErrorHandler, IHttpErrorsOptions } from './interfaces';
import { ExpressConfig } from '../express/express.config';


@Service()
export class ErrorRegistry {
  private httpErrors?: IHttpErrorsOptions;
  private logger: Logger;

  constructor(expressConfig: ExpressConfig, logger: Logger) {
    this.httpErrors = expressConfig.httpErrors;
    this.logger = logger;
  }

  private defaultHandler(error: HttpError, res: express.Response) {    
    res.status(error.code).json({
      error: error.message,
      data: error.data
    });
  }

  handleError(error: HttpError | Error, res: express.Response) {
    const httpError: HttpError = error instanceof HttpError ? error : new InternalServerError(error.message);

    let handler!: HttpErrorHandler;

    const customErrors = this.httpErrors?.customErrors;

    if (customErrors) {
      const customErr = customErrors.find(err => httpError instanceof err.error);
      
      if (customErr) {
        handler = customErr.handler;
      }
    }
    else if (this.httpErrors?.handler) {
      handler = this.httpErrors.handler;
    }
    else {
      handler = this.defaultHandler;
    }
    
    handler(httpError, res, this.logger);
  }
}