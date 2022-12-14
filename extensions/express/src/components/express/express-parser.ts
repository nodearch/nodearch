import { ComponentInfo, Service } from '@nodearch/core';
import { ExpressAnnotationId } from './enums';
import { IExpressInfo, IExpressRoute, IExpressRouteHandlerInput, IHttpControllerOptions } from './interfaces';
import { IMiddlewareInfo } from '../middleware/interfaces';


@Service()
export class ExpressParser {
  parse(componentsInfo: ComponentInfo<IHttpControllerOptions>[]) {
    const expressInfo: IExpressInfo = { routers: [] };

    componentsInfo.forEach(comp => {
      const middleware: IMiddlewareInfo[] = comp
        .getDecoratorsById(ExpressAnnotationId.Use)
        .filter(deco => !deco.method)
        .map(deco => {
          const dependencyKey = deco.dependencies && deco.dependencies.length ? deco.dependencies[0].key : undefined;
          return { ...deco.data, dependencyKey };
        });

      const ctrlPath = this.formatPath(comp.data);

      const routes = comp.getMethods()
        .map(method => {
          return this.getRouteInfo(comp, method);
        });

      expressInfo.routers.push({
        controllerInfo: comp,
        path: ctrlPath,
        middleware,
        routes
      });
    });

    return expressInfo;
  }

  private getRouteInfo(componentInfo: ComponentInfo, method: string): IExpressRoute {
    const decorators = componentInfo.getDecoratorsByMethod(method);

    const { httpPath, httpMethod } = decorators
      .find(deco => deco.id === ExpressAnnotationId.HttpMethod)?.data;
    
    const middleware: IMiddlewareInfo[] = decorators
      .filter(deco => deco.id === ExpressAnnotationId.Use)
      .map(deco => {
        const dependencyKey = deco.dependencies && deco.dependencies.length ? deco.dependencies[0].key : undefined;

        return { ...deco.data, dependencyKey };
      });
    
    const inputs: IExpressRouteHandlerInput[] = decorators
      .filter(deco => deco.id === ExpressAnnotationId.HttpParam)
      .map(deco => deco.data);

    return {
      controllerMethod: method,
      method: httpMethod,
      path: this.formatPath(httpPath),
      middleware,
      inputs
    };
  }

  private formatPath(urlPath?: string) {
    let newPath = urlPath || '';
    
    if (!newPath.startsWith('/')) {
      newPath = '/' + newPath;
    }
    
    if (newPath.length > 1 && newPath.endsWith('/')) {
      newPath = newPath.slice(0, newPath.length - 1);
    }
    
    return newPath;
  }
}