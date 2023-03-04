import { Service } from '@nodearch/core';
import { camelToTitle } from '@nodearch/core/utils';
import { OAISchema, IOpenAPIAppMapItem, IOpenAPIProviderData, IOpenAPIAppRouteMap } from '@nodearch/openapi';
import { HttpMethod } from '../express/enums.js';
import { ExpressParser } from '../express/express-parser.js';
import { ExpressConfig } from '../express/express.config.js';


@Service()
export class OpenAPIParser {
  
  public appMap: IOpenAPIAppMapItem[] = [];

  constructor(
    private readonly expressConfig: ExpressConfig,
    private readonly expressParser: ExpressParser
  ) {}

  parse() {
    const providerData: IOpenAPIProviderData = {
      servers: this.getServers(),
      routes: this.getRoutes()
    };

    return providerData;
  }

  private getRoutes() {
    const routes: IOpenAPIAppRouteMap[] = []

    const expressInfo = this.expressParser.getExpressInfo();

    expressInfo.routers.forEach(router => {
      
      router.routes.forEach(route => {
        const urlPath = this.mergePaths(router.path, route.path);
        const pathInfo = this.getPathInfo(urlPath);

        routes.push({
          app: {
            component: router.controllerInfo.getClass(),
            method: route.controllerMethod
          },
          schema: {
            path: pathInfo.path,
            method: route.method,
            data: this.getOperationObject(pathInfo.params, route.controllerMethod, route.method)
          }
        });
      });

    });

    return routes;
  }

  private getServers() {
    return [{
      url: 'http://' + this.expressConfig.hostname + ':' + this.expressConfig.port,
      description: 'Express Server URL'
    }];
  }

  private getOperationObject(params: string[], controllerMethod: string, httpMethod: HttpMethod): Partial<OAISchema.OperationObject> {
    const opObj: Partial<OAISchema.OperationObject> = {
      summary: controllerMethod,
      description: camelToTitle(controllerMethod),
      parameters: this.getPathParams(params),
      responses: {
        200: { description: 'OK' },
        500: { description: 'Internal Server Error' }
      },
      tags: ['default']
    };

    if ([HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH].includes(httpMethod)) {
      opObj['requestBody'] = {content: { 'application/json': { schema: { type: 'object' } } }};
    }

    return opObj;
  }

  private getPathParams(params: string[]): OAISchema.ParameterObject[] {
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