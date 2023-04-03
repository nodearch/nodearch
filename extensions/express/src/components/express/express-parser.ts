import { AppContext, Service } from '@nodearch/core';
import { IExpressInfo, IExpressRoute, IExpressRouteHandlerInput, IHttpMethodInfo } from './interfaces.js';
import { IMiddlewareInfo } from '../middleware/interfaces.js';
import { ComponentInfo, CoreDecorator, DecoratorType, IComponentDecorator } from '@nodearch/core/decorators';
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

  private parse(componentsInfo: ComponentInfo[]) {
    const expressInfo: IExpressInfo = { routers: [] };

    componentsInfo.forEach(comp => {
      // Get Component/Class level @Use() decorators that contains middleware
      const ctrlMiddleware: IMiddlewareInfo[] = comp
        .getDecorators({
          useId: ExpressDecorator.MIDDLEWARE,
          placement: [DecoratorType.CLASS]
        })
        .map(deco => {
          return { ...deco.data, dependencyKey: deco.dependencies[0].key };
        })
        .reverse();

      // Parse route information for this controller
      const routes = comp
        .getDecorators({
          // Decorators like @Get(), @Post(), etc
          id: ExpressDecorator.HTTP_METHOD 
        })
        .map(deco => {
          return this.getRouteInfo(comp, deco);
        });

      expressInfo.routers.push({
        controllerInfo: comp,
        path: this.getControllerPath(comp),
        routes,
        middleware: ctrlMiddleware
      });
    });

    return expressInfo;
  }

  private getRouteInfo(componentInfo: ComponentInfo, decoratorInfo: IComponentDecorator<IHttpMethodInfo>): IExpressRoute {

    const { httpPath, httpMethod } = decoratorInfo.data;

    // Get middleware on the method level
    const middleware: IMiddlewareInfo[] = componentInfo
      .getDecorators({ 
        useId: ExpressDecorator.MIDDLEWARE,
        method: decoratorInfo.method 
      })
      .map(deco => {
        return { ...deco.data, dependencyKey: deco.dependencies[0].key };
      })
      .reverse();

    // Get required inputs on this method e.g. @Body(), @Param(), etc
    const inputs: IExpressRouteHandlerInput[] = componentInfo
      .getDecorators({
        id: ExpressDecorator.HTTP_PARAM,
        method: decoratorInfo.method
      })
      .map(deco => deco.data);

    return {
      controllerMethod: decoratorInfo.method!, // Method will always be there since this is an HttpMethod decorator
      method: httpMethod,
      path: this.formatPath(httpPath),
      middleware,
      inputs
    };
  }

  private getControllerPath(comp: ComponentInfo) {
    let ctrlPath = '';

    const ctrlPathDecorator = comp.getDecorators({ id: ExpressDecorator.HTTP_PATH })[0];

    if (ctrlPathDecorator) {
      ctrlPath = this.formatPath(ctrlPathDecorator.data.httpPath);
    }

    return ctrlPath;
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