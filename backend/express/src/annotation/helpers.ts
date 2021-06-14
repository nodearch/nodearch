import { ControllerMetadata } from '../metadata';
import { HttpMethod, RouteHandlerParam } from '../enums';

export function httpMethodFactory(httpMethod: HttpMethod, path?: string) {
  return (target: any, propKey: string | symbol) => {
    ControllerMetadata.setHttpInfo(target.constructor, {
      name: <string>propKey,
      httpMethod,
      httpPath: getPath(path)
    });
  };
}

export function handlerParamFactory (paramType: RouteHandlerParam, key?: string) {
  return (target: Object, propKey: string | symbol, paramIndex: number) => {
    ControllerMetadata.setHttpParamsInfo(target.constructor, <string>propKey, {
      index: paramIndex,
      type: paramType,
      key
    })
  };
}

export function getPath(path?: string): string {
  let routePath = '/';

  if (path) {
    routePath = path.charAt(0) === '/' ? path : '/' + path;
  }

  return routePath;
}

export function getRouterPrefix(path: string): string {

  if (path === '') {
    return path;
  }
  else {
    let routePath = path.charAt(path.length - 1) === '/' ? path.slice(0, path.length - 1) : path;
    routePath = routePath.charAt(0) === '/' ? routePath : '/' + routePath;

    return routePath;
  }
}