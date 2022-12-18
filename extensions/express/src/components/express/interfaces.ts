import { HttpMethod, RouteHandlerParam } from './enums';
import { IMiddlewareInfo } from '../middleware/interfaces';
import { ComponentInfo } from '@nodearch/core';
import { IHttpErrorsOptions } from '../errors/interfaces';
import http from 'http';
import https from 'https';
import express from 'express';
import { Stats } from 'fs';


export interface IExpressAppOptions {
  hostname?: string;
  port?: number;

  http?: http.ServerOptions;
  https?: https.ServerOptions;

  httpErrors?: IHttpErrorsOptions;

  static?: IExpressStatic[];
}

export interface IExpressStatic {
  path: string;
  root: string;
  options?: {
    dotfiles?: string;
    etag?: boolean;
    extensions?: string[];
    fallthrough?: boolean;
    immutable?: boolean;
    index?: string | boolean;
    lastModified?: boolean;
    maxAge?: number | string;
    redirect?: boolean;
    setHeaders?: (res: express.Response, path: string, stat: Stats) => void;
  }; 
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