import express from 'express';
import { HttpError } from './errors';
import { ILogger, ClassConstructor } from '@nodearch/core';

export type HttpErrorHandler = (error: HttpError | Error, res: express.Response, logger: ILogger) => void;

export type MiddlewareHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

export type ContextMiddlewareHandler = ClassConstructor<{ handler: (req: express.Request, res: express.Response) => Promise<void>; }>;
