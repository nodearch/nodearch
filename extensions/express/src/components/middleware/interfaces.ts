import express from 'express';
import { ClassConstructor } from '@nodearch/core';


export type ExpressMiddlewareHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

export type MiddlewareProvider<T> = { handler: (req: express.Request, res: express.Response, options: T) => Promise<void>; };

export type MiddlewareHandler<T = undefined> = ClassConstructor<MiddlewareProvider<T>>;