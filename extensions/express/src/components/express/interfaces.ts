import { HttpMethod, RouteHandlerParam } from './enums.js';
import { IExpressMiddlewareHandler, IMiddlewareInfo } from '../middleware/interfaces.js';
import { IHttpErrorsOptions } from '../errors/interfaces.js';
import http from 'node:http';
import https from 'node:https';
import express from 'express';
import { OptionsJson, OptionsText, OptionsUrlencoded } from 'body-parser';
import { Stats } from 'node:fs';
import { ComponentInfo } from '@nodearch/core/components';


export interface IExpressAppOptions {
  /**
   * Hostname for the express server
   */
  hostname?: string;

  /**
   * Port for the express server
   */
  port?: number;

  // Global Path prefix for all routes 
  httpPath?: string;

  /**
   * Http server options
   */
  http?: http.ServerOptions;

  /**
   * Https server options
   */
  https?: https.ServerOptions;

  /**
   * Http errors handlers
   */
  httpErrors?: IHttpErrorsOptions;

  /**
   * Static files to be served by express
   */
  static?: IExpressStatic[];

  /** 
   * Global middleware to be used by express
   * and applied to all routes
   */
  use?: IExpressMiddlewareHandler[];

  /**
   * Express parsers configuration
   */
  parsers?: IExpressParsersOptions;

  httpLogger?: IHttpLogger; 
}

export interface IExpressParsersOptions {
  json?: IJsonParserOptions;
  text?: ITextParserOptions;
  urlencoded?: IUrlencodedParserOptions;
}

/**
 * Enable/Configure json parser
 * @default true
 */
export interface IJsonParserOptions {
  enable: boolean;
  options?: OptionsJson;
}

/**
 * Enable/Configure text parser
 * @default false
 */
export interface ITextParserOptions {
  enable: boolean;
  options?: OptionsText;
}

/**
 * Enable/Configure urlencoded parser
 * @default true
 */
export interface IUrlencodedParserOptions {
  enable: boolean;
  options?: OptionsUrlencoded;
}

/**
 * Enable/Configure http logger
 * @default true
 */
export interface IHttpLogger {
  enable: boolean;
  showHeaders?: boolean;
  showBody?: boolean;
  showQuery?: boolean;
  showParams?: boolean;
  showCookies?: boolean;
  showStatus?: boolean;
  showDuration?: boolean;
  custom?(req: express.Request): string;
}


export interface IExpressStatic {
  httpPath: string;
  filePath: string | URL;
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


export interface IHttpMethodInfo {
  name: string;
  httpMethod: HttpMethod;
  httpPath: string;
}