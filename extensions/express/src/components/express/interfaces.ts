import { HttpMethod, RouteHandlerParam } from './enums';
import { IMiddlewareInfo } from '../middleware/interfaces';
import { ComponentInfo } from '@nodearch/core';
import { IHttpErrorsOptions } from '../errors/interfaces';
import http from 'http';
import https from 'https';


export interface IExpressAppOptions {
  hostname?: string;
  port?: number;

  http?: http.ServerOptions;
  https?: https.ServerOptions;

  httpErrors?: IHttpErrorsOptions;
}

export interface IExpressInfo {
  routers: IExpressRouter[];
}

export interface IExpressRouter {
  controllerInfo: ComponentInfo;
  path: string;
  routes: IExpressRoute[];
  middleware: IMiddlewareInfo[];
}

export interface IExpressRoute {
  controllerMethod: string;
  path: string;
  method: HttpMethod;
  middleware: IMiddlewareInfo[];
  inputs: IExpressRouteHandlerInput[];
}

export interface IExpressRouteHandlerInput {
  index: number;
  type: RouteHandlerParam;
  key?: string;
}

export type IHttpControllerOptions = string;