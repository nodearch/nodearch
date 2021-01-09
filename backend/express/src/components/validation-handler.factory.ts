import express from 'express';
import { ControllerMetadata } from '../metadata';
import { ClassConstructor, Service } from '@nodearch/core';
import { IRequestData, IValidationSchema } from '../interfaces';
import Joi from 'joi';
import { ServerConfig } from './server.config';
import { HttpErrorsRegistry } from './errors-registry.service';
import { BadRequest } from '../errors';

// TODO: improvement required -> if we removed the decorator from here it will complain
// about -> Can't resolve Component ExpressHook ( it's a heigh level error )
@Service()
export class ValidationHandlerFactory {

  private validationOptions: Joi.ValidationOptions;
  private httpErrorsRegistry: HttpErrorsRegistry;

  constructor(serverConfig: ServerConfig, httpErrorsRegistry: HttpErrorsRegistry) {
    this.validationOptions = serverConfig.joiValidationOptions;
    this.httpErrorsRegistry = httpErrorsRegistry;
  }

  getControllerValidationInfo(controller: ClassConstructor) {
    return ControllerMetadata.getValidation(controller);
  }

  createHandler (validationSchema: IValidationSchema) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const dataToValidate: IRequestData = {};

      Object.assign(dataToValidate, {
        params: req.params,
        headers: req.headers,
        query: req.query,
        body: req.body
      });

      const result = Joi.object().keys(<any>validationSchema).validate(dataToValidate, this.validationOptions);

      if (result.error) {
        this.httpErrorsRegistry.handleError(new BadRequest(result.error.message, result.error.details), res);
      }
      else {
        Object.assign(req, result.value);
        next();
      }

    };
  }

}