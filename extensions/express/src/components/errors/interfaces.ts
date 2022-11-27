import { ClassConstructor, ILogger } from '@nodearch/core';
import express from 'express';
import { HttpError } from './http-errors';


export interface IHttpErrorsOptions {
  handler?: HttpErrorHandler;
  customErrors?: IHttpErrorHandlerInfo[];
}

export type HttpErrorHandler = (error: HttpError, res: express.Response, logger: ILogger) => void;

export interface IHttpErrorHandlerInfo {
  error: ClassConstructor;
  handler: HttpErrorHandler;
}