import express from 'express';
import { IUseProvider, IUseProviderClass } from '@nodearch/core/components';


export type IExpressMiddlewareHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

export type IMiddlewareProviderArgs = { req: express.Request; res: express.Response; };

export type IMiddlewareProvider = IUseProvider<IMiddlewareProviderArgs, any>;

export type IMiddlewareProviderClass<T = undefined> = IUseProviderClass<T>;

export interface IMiddlewareInfo {
  component: IMiddlewareProviderClass;
  options?: any;
  dependencyKey?: string;
}

export interface IExpressMiddlewareHandlerOptions {
  args: { 
    req: express.Request;
    res: express.Response; 
  };
  options: IExpressMiddlewareHandler;
}