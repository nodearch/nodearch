import { Service } from '@nodearch/core';
import { OpenAPIObject, PathsObject, OperationObject, ParameterObject, IOpenAPIAppMapItem } from '@nodearch/openapi';
import { IExpressInfo } from '../express/interfaces';

@Service()
export class OpenAPIParser {
  
  appMap: IOpenAPIAppMapItem[] = [];

  private expressInfo!: IExpressInfo;

  init(expressInfo: IExpressInfo) {
    this.expressInfo = expressInfo;
  }

  parse(): Partial<OpenAPIObject> {
    const paths: PathsObject = {};

    this.expressInfo.routers.forEach(router => {
      
      router.routes.forEach(route => {
        const urlPath = this.mergePaths(router.path, route.path);
        const pathInfo = this.getPathInfo(urlPath);

        paths[pathInfo.path] = paths[pathInfo.path] || {};
        paths[pathInfo.path][route.method] = this.getOperationObject(pathInfo.params);

        this.appMap.push({
          component: router.controllerInfo.getClass(),
          method: route.controllerMethod,
          httpMethod: route.method,
          httpPath: pathInfo.path
        });
      });

    });

    return {
      paths
    };
  }

  private getOperationObject(params: string[]): Partial<OperationObject> {
    return {
      parameters: this.getPathParams(params)
    };
  }

  private getPathParams(params: string[]): ParameterObject[] {
    return params.map(param => {
      return {
        name: param,
        in: 'path',
        schema: { type: 'string' },
        required: true
      };
    });
  }

  private mergePaths(...paths: string[]) {
    return paths.reverse().reduce((acc, curr) => {
      curr = curr.endsWith('/') ? curr.slice(0, curr.length - 1) : curr;
      return curr += acc;
    }, '') || '/';
  }

  private getPathInfo(urlPath: string) {
    let path = urlPath;
    const params: string[] = [];
    const matches = urlPath.matchAll(/(\/|\.)?:([A-Za-z0-9_]+)(\/|\.)?/g);
  
    for (const match of matches) {
      params.push(match[2]);
      path = path.replace(':' + match[2], `{${match[2]}}`);
    }
    
    return { path, params };
  }
}