import express from 'express';
import { Logger, Service } from '@nodearch/core';
import { HttpError, InternalServerError } from './http-errors.js';
import { HttpErrorHandler, IHttpErrorsOptions } from './interfaces.js';
import { ExpressConfig } from '../express/express.config.js';


@Service()
export class ErrorRegistry {
  private httpErrors?: IHttpErrorsOptions;
  private logger: Logger;

  constructor(expressConfig: ExpressConfig, logger: Logger) {
    this.httpErrors = expressConfig.httpErrors;
    this.logger = logger;
  }

  private defaultHandler(error: HttpError | Error, res: express.Response) {

    const httpError: HttpError = error instanceof HttpError ? error : new InternalServerError(error.message);

    if (httpError instanceof InternalServerError) { 
      this.logger.error(httpError);
      
      res.status(httpError.code).json({
        error: 'Internal Server Error'
      });
    }
    else {
      res.status(httpError.code).json({
        error: httpError.message,
        details: httpError.details
      });
    }
  }

  handleError(error: HttpError | Error, res: express.Response) {
    let handler!: HttpErrorHandler;
    const customErrors = this.httpErrors?.customErrors;

    if (customErrors) {
      const customErr = customErrors.find(err => error instanceof err.error);
      
      if (customErr) {
        handler = customErr.handler;
      }
    }

    handler = handler || this.httpErrors?.handler;

    handler = handler || this.defaultHandler.bind(this);

    handler(error as HttpError, res, this.logger);
  }
}