import express from 'express';
import { HttpError } from './http-errors';
import { ILogger, ClassConstructor } from '@nodearch/core';
import Joi from '@hapi/joi';

export type HttpErrorHandler = (error: HttpError | Error, res: express.Response, logger: ILogger) => void;

export type ExpressMiddlewareHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

export type MiddlewareProvider<T> = { handler: (req: express.Request, res: express.Response, options: T) => Promise<void>; };

export type MiddlewareHandler<T = undefined> = ClassConstructor<MiddlewareProvider<T>>;

export interface IValidationSchema {
  headers?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  body?: Joi.Schema;
}