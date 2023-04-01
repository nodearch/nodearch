import { AppContext, Service } from '@nodearch/core';
import { IExpressInfo, IExpressRoute, IExpressRouteHandlerInput, IHttpControllerOptions } from './interfaces.js';
import { IMiddlewareInfo } from '../middleware/interfaces.js';
import { ComponentInfo, CoreDecorator } from '@nodearch/core/decorators';
import { ExpressDecorator } from './enums.js';


@Service()
export class ExpressParser {

  private expressInfo: IExpressInfo;

  constructor(appContext: AppContext) {
    this.expressInfo = { routers: [] };

    const componentsInfo = appContext.components.get({
      id: CoreDecorator.CONTROLLER,
      decoratorIds: [
        ExpressDecorator.HTTP_METHOD
      ] 
    });

    if (componentsInfo) {
      this.expressInfo = this.parse(componentsInfo);
    }
  }

  getExpressInfo() {
    return this.expressInfo;
  }

  private parse(componentsInfo: ComponentInfo<IHttpControllerOptions>[]) {
    const expressInfo: IExpressInfo = { routers: [] };

    componentsInfo.forEach(comp => {
      const middleware: IMiddlewareInfo[] = comp
        .getUseDecorators(ExpressDecorator.MIDDLEWARE)
        .filter(deco => !deco.method)
        .map(deco => {
          const dependencyKey = deco.dependencies && deco.dependencies.length ? deco.dependencies[0].key : undefined;
          return { ...deco.data, dependencyKey };
        })
        .reverse();

      const ctrlPathDecorator = comp.getDecoratorsById(ExpressDecorator.HTTP_PATH)[0];
      let ctrlPath = '';

      if (ctrlPathDecorator) {
        ctrlPath = this.formatPath(ctrlPathDecorator.data.httpPath);
      }

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
    const decorators = componentInfo.getDecorators({ method, useId: ExpressDecorator.MIDDLEWARE });

    const { httpPath, httpMethod } = decorators
      .find(deco => deco.id === ExpressDecorator.HTTP_METHOD)?.data;
    
    const middleware: IMiddlewareInfo[] = decorators
      .filter(deco => deco.id === CoreDecorator.USE)
      .map(deco => {
        const dependencyKey = deco.dependencies && deco.dependencies.length ? deco.dependencies[0].key : undefined;

        return { ...deco.data, dependencyKey };
      })
      .reverse();
    
    const inputs: IExpressRouteHandlerInput[] = decorators
      .filter(deco => deco.id === ExpressDecorator.HTTP_PARAM)
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