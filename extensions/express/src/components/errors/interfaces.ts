import { ILogger } from '@nodearch/core';
import { ClassConstructor } from '@nodearch/core/utils';
import express from 'express';
import { HttpError } from './http-errors.js';


export interface IHttpErrorsOptions {
  handler?: HttpErrorHandler;
  customErrors?: IHttpErrorHandlerInfo[];
}

export type HttpErrorHandler = (error: HttpError, res: express.Response, logger: ILogger) => void;

export interface IHttpErrorHandlerInfo {
  error: ClassConstructor;
  handler: HttpErrorHandler;
}