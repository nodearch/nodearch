import { HttpMethod, HTTPParam } from './enums';
import { HttpErrorHandler, MiddlewareHandler, ContextMiddlewareHandler } from './types';
import { ClassConstructor } from '@nodearch/core';
import { OpenAPIOptions, OperationObject } from './components/openapi';
import Joi from '@hapi/joi';
import multer from 'multer';
import express from 'express';


export interface IExpressServerOptions {
  expressApp: express.Application;
  hostname?: string;
  port?: number;
  httpErrorsOptions?: IHttpErrorsOptions;
  joiValidationOptions?: Joi.ValidationOptions;
  openAPIOptions?: OpenAPIOptions;
  fileUploadOptions?: multer.Options;
}

export interface IHTTPMethodParamInfo {
  index: number;
  type: HTTPParam;
  key?: string;
}

export interface IHTTPInfo {
  httpMethod: HttpMethod;
  httpPath: string;
}

export interface IHttpControllerMethod extends IHTTPInfo {
  name: string;
  params: IHTTPMethodParamInfo[];
}

export interface IHttpControllerInfo {
  methods: IHttpControllerMethod[];
}

export interface IHttpErrorHandlerInfo {
  error: ClassConstructor;
  handler: HttpErrorHandler;
}

export interface IHttpErrorsOptions {
  handler?: HttpErrorHandler;
  customErrors?: IHttpErrorHandlerInfo[];
}

export interface IMiddlewareMetadataInfo {
  middleware: MiddlewareHandler | ContextMiddlewareHandler;
  method?: string;
}

export interface IValidationSchema {
  headers?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  body?: Joi.Schema;
}

export interface IValidationMetadataInfo {
  validation: IValidationSchema;
  method: string;
}

export interface IRequestData {
  headers?: { [key: string]: string };
  query?: { [key: string]: string };
  params?: any[];
  body?: any;
}

export interface IRouteInfo {
  methodName: string;
  httpInfo: IHttpControllerMethod;
  validation?: IValidationSchema;
  fileUpload?: IFileUploadInfo[];
  openApiInfo?: IOpenAPIInfo;
}

export interface IUploadInfo {
  /** by default it allow any file */
  files?: string[] | IFileUploadInfo[]

  /** by default it allow files */
  allowFiles?: boolean;

  /** Options for initializing a Upload instance. */
  options?: multer.Options
}

export interface IFileUploadInfo {
  name: string;
  maxCount?: number;
}

export interface IFileUploadMetadataInfo {
  uploadInfo: IUploadInfo;
  method: string;
}

export interface IOpenAPIMetadataInfo {
  openAPIInfo: IOpenAPIInfo;
  method?: string;
}

export interface IOpenAPIInfo extends OperationObject {
  enable?: boolean;
}