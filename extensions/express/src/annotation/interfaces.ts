import express from 'express';
import { HttpError } from './http-errors';
import { ILogger, ClassConstructor } from '@nodearch/core';

export type HttpErrorHandler = (error: HttpError | Error, res: express.Response, logger: ILogger) => void;

export type ExpressMiddlewareHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

export type MiddlewareProvider<T> = { handler: (req: express.Request, res: express.Response, options: T) => Promise<void>; };

export type MiddlewareHandler<T = undefined> = ClassConstructor<MiddlewareProvider<T>>;