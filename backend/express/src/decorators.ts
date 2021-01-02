import { HttpMethod, HTTPParam } from './enums';
import { ControllerMetadata } from './metadata';
import { MiddlewareHandler, ContextMiddlewareHandler } from './types';
import { ClassMethodDecorator, Component } from '@nodearch/core';
import { IValidationSchema, IFileUploadInfo, IOpenAPIInfo, IUploadInfo } from './interfaces';

function getPath(path?: string): string {
  let routePath = '/';

  if (path) {
    routePath = path.charAt(0) === '/' ? path : '/' + path;
  }

  return routePath;
}

function getRouterPrefix(path: string): string {

  if (path === '') {
    return path;
  }
  else {
    let routePath = path.charAt(path.length - 1) === '/' ? path.slice(0, path.length - 1) : path;
    routePath = routePath.charAt(0) === '/' ? routePath : '/' + routePath;

    return routePath;
  }
}

function httpInfoDecoratorFactory(httpMethod: HttpMethod, path?: string) {
  return (target: any, propKey: string | symbol) => {
    ControllerMetadata.setHttpInfo(target, propKey, {
      httpMethod,
      httpPath: getPath(path)
    });
  };
}

function paramDecoratorFactory (paramType: HTTPParam, key?: string) {
  return (target: Object, propKey: string | symbol, paramIndex: number) => {
    ControllerMetadata.setHttpParamsInfo(target, propKey, {
      index: paramIndex,
      type: paramType,
      key
    })
  };
}



/**
 * Class Decorator to prefix all HTTP methods in a Controller with express compatible HTTP path.
 * @param path
 *  The path can be any of:
 *    - A string representing a path.
 *    - A path pattern.
 *    - A regular expression pattern to match paths.
 *    - An array of combinations of any of the above.
 *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
 */
export function HttpPath(path: string): ClassDecorator {
  return function(target: object) {
    ControllerMetadata.setHttpPrefix(target, getRouterPrefix(path));
  };
}

/**
 * Method Decorator to route HTTP GET requests to the specified path.
 * @param path
 *  The path for which the controller method is invoked. can be any of:
 *    - A string representing a path.
 *    - A path pattern.
 *    - A regular expression pattern to match paths.
 *    - An array of combinations of any of the above.
 *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
 */
export const HttpGet = (path?: string): MethodDecorator => httpInfoDecoratorFactory(HttpMethod.GET, path);


/**
 * Method Decorator to route HTTP HEAD requests to the specified path.
 * @param path
 *  The path for which the controller method is invoked. can be any of:
 *    - A string representing a path.
 *    - A path pattern.
 *    - A regular expression pattern to match paths.
 *    - An array of combinations of any of the above.
 *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
 */
export const HttpHead = (path?: string): MethodDecorator => httpInfoDecoratorFactory(HttpMethod.HEAD, path);


/**
 * Method Decorator to route HTTP POST requests to the specified path.
 * @param path
 *  The path for which the controller method is invoked. can be any of:
 *    - A string representing a path.
 *    - A path pattern.
 *    - A regular expression pattern to match paths.
 *    - An array of combinations of any of the above.
 *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
 */
export const HttpPost = (path?: string): MethodDecorator => httpInfoDecoratorFactory(HttpMethod.POST, path);


/**
 * Method Decorator to route HTTP PUT requests to the specified path.
 * @param path
 *  The path for which the controller method is invoked. can be any of:
 *    - A string representing a path.
 *    - A path pattern.
 *    - A regular expression pattern to match paths.
 *    - An array of combinations of any of the above.
 *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
 */
export const HttpPut = (path?: string): MethodDecorator => httpInfoDecoratorFactory(HttpMethod.PUT, path);


/**
 * Method Decorator to route HTTP PATCH requests to the specified path.
 * @param path
 *  The path for which the controller method is invoked. can be any of:
 *    - A string representing a path.
 *    - A path pattern.
 *    - A regular expression pattern to match paths.
 *    - An array of combinations of any of the above.
 *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
 */
export const HttpPatch = (path?: string): MethodDecorator => httpInfoDecoratorFactory(HttpMethod.PATCH, path);

/**
 * Method Decorator to route HTTP DELETE requests to the specified path.
 * @param path
 *  The path for which the controller method is invoked. can be any of:
 *    - A string representing a path.
 *    - A path pattern.
 *    - A regular expression pattern to match paths.
 *    - An array of combinations of any of the above.
 *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
 */
export const HttpDelete = (path?: string): MethodDecorator => httpInfoDecoratorFactory(HttpMethod.DELETE, path);


/**
 * Method Decorator to route HTTP OPTIONS requests to the specified path.
 * @param path
 *  The path for which the controller method is invoked. can be any of:
 *    - A string representing a path.
 *    - A path pattern.
 *    - A regular expression pattern to match paths.
 *    - An array of combinations of any of the above.
 *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
 */
export const HttpOptions = (path?: string): MethodDecorator => httpInfoDecoratorFactory(HttpMethod.OPTIONS, path);


export const HttpRes = (): ParameterDecorator => paramDecoratorFactory(HTTPParam.RES);
export const HttpReq = (): ParameterDecorator => paramDecoratorFactory(HTTPParam.REQ);
export const HttpBody = (): ParameterDecorator => paramDecoratorFactory(HTTPParam.BODY);
export const HttpParams = (key: string): ParameterDecorator => paramDecoratorFactory(HTTPParam.PARAMS, key);
export const HttpHeaders = (key: string): ParameterDecorator => paramDecoratorFactory(HTTPParam.HEADERS, key);
export const HttpQuery = (key?: string): ParameterDecorator => paramDecoratorFactory(HTTPParam.QUERY, key);


export function MiddlewareProvider(): ClassDecorator{
  return function(target: any) {
    ControllerMetadata.setMiddlewareProvider(target);
    Component()(target);
  };
}


export function Middleware(middlewareHandler: MiddlewareHandler): ClassMethodDecorator;
export function Middleware(middlewareHandler: ContextMiddlewareHandler): ClassMethodDecorator;
export function Middleware(handler: MiddlewareHandler | ContextMiddlewareHandler): ClassMethodDecorator {
  return function(target: Object, propertyKey?: string) {
    ControllerMetadata.setMiddleware(propertyKey ? target.constructor : target, {
      middleware: handler,
      method: propertyKey
    });
  };
}

export function Validation(validationSchema: IValidationSchema): MethodDecorator {
  return function (target: Object, propKey: string | symbol) {
    ControllerMetadata.setValidation(target.constructor, {
      validation: validationSchema,
      method: <string>propKey
    });
  };
}


/**
 * Method Decorator to parse formdata to json in req.body
 * all files will be exits in req.body.files
 * any file allowed by default
 */
export function Upload(files: IFileUploadInfo): MethodDecorator;
export function Upload(files: IFileUploadInfo[]): MethodDecorator;
export function Upload(files: string): MethodDecorator;
export function Upload(files: string[]): MethodDecorator;
export function Upload(options?: IUploadInfo): MethodDecorator;
export function Upload(options?: any): MethodDecorator {
  return function (target: Object, propKey: string | symbol) {
    let uploadInfo: IUploadInfo = { allowFiles: true };

    if(options) {
      if (Array.isArray(options) && options.length) {
        uploadInfo.files = typeof options[0] === 'string' ? 
          options.map(fileName => ({ name: fileName, maxCount: 1 })) : options;
      }
      else if ((<IFileUploadInfo> options).name) {
        uploadInfo.files = [options];
      }
      else if (typeof options === 'string') {
        uploadInfo.files = [{ name: options, maxCount: 1 }];
      }
      else {
        uploadInfo = { ...uploadInfo, ...options };

        if (uploadInfo.files?.length && typeof uploadInfo.files[0] === 'string') {
          uploadInfo.files = (<string[]> uploadInfo.files).map(fileName => ({ name: fileName }));
        }
      }
    }

    ControllerMetadata.setUploadInfo(target.constructor, {
      uploadInfo,
      method: <string>propKey
    });
  };
}

export function OpenAPI(openAPIInfo: IOpenAPIInfo): ClassMethodDecorator {
  return function (target: Object, propKey?: string) {
    if (propKey) {
      ControllerMetadata.setOpenApiInfo(target.constructor, { openAPIInfo, method: propKey });
    }
    else {
      ControllerMetadata.setOpenApiInfo(target, { openAPIInfo });
    }
  };
}