import { HttpMethod, RouteHandlerParam } from './enums';
import { ExpressMiddlewareHandler, MiddlewareHandler } from '../middleware/interfaces';
import { IOpenAPIInfo } from '../openapi/interfaces';
import { IUploadInfo } from '../upload/interfaces';
import { IValidationSchema } from '../validation/interfaces';


export interface IExpressAppOptions {}

export interface IExpressInfo {
  routers: IExpressRouter[];
}

export interface IExpressRouter {
  path: string;
  openApi?: IOpenAPIInfo;
  routes: IExpressRoute[];
  middleware: IExpressMiddleware[];
}

export interface IExpressRoute {
  path: string;
  method: HttpMethod;
  middleware: IExpressMiddleware[];
  inputs: IExpressRouteHandlerInput[];
  openApi?: IOpenAPIInfo;
  validation?: IValidationSchema;
  upload?: IUploadInfo;
}

export interface IExpressMiddleware {
  isExpressMiddleware: boolean;
  handler: ExpressMiddlewareHandler | MiddlewareHandler;
  options?: any;
  dependencyKey?: symbol;
}

export interface IExpressRouteHandlerInput {
  index: number;
  type: RouteHandlerParam;
  key?: string;
}