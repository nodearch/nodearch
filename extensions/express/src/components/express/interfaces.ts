import { HttpMethod, RouteHandlerParam } from './enums';
import { IMiddlewareInfo } from '../middleware/interfaces';
import { IOpenAPIInfo, OpenAPIOptions } from '../openapi/interfaces';
import { IUploadInfo } from '../upload/interfaces';
import { IValidationSchema } from '../validation/interfaces';
import { ComponentInfo } from '@nodearch/core';
import express from 'express';
import { IHttpErrorsOptions } from '../errors/interfaces';
import Joi from 'joi';
import multer from 'multer';
import http from 'http';
import https from 'https';


export interface IExpressAppOptions {
  expressApp: express.Application;
  httpErrorsOptions?: IHttpErrorsOptions;
  joiValidationOptions?: Joi.ValidationOptions;
  openAPIOptions?: OpenAPIOptions;
  fileUploadOptions?: multer.Options;
  hostname?: string;
  port?: number;
  server?: http.Server | https.Server;
}

export interface IExpressInfo {
  routers: IExpressRouter[];
}

export interface IExpressRouter {
  controllerInfo: ComponentInfo;
  path: string;
  openApi?: IOpenAPIInfo;
  routes: IExpressRoute[];
  middleware: IMiddlewareInfo[];
}

export interface IExpressRoute {
  controllerMethod: string;
  path: string;
  method: HttpMethod;
  middleware: IMiddlewareInfo[];
  inputs: IExpressRouteHandlerInput[];
  openApi?: IOpenAPIInfo;
  validation?: IValidationSchema;
  upload?: IUploadInfo;
}

export interface IExpressRouteHandlerInput {
  index: number;
  type: RouteHandlerParam;
  key?: string;
}