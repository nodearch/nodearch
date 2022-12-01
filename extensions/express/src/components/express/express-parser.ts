import { ComponentInfo, Service } from '@nodearch/core';
import { IOpenAPIInfo } from '../openapi/interfaces';
import { IUploadInfo } from '../file-upload/interfaces';
import { IValidationSchema } from '../validation/interfaces';
import { ExpressAnnotationId } from './enums';
import { IExpressInfo, IExpressRoute, IExpressRouteHandlerInput } from './interfaces';
import { IMiddlewareInfo } from '../middleware/interfaces';


@Service()
export class ExpressParser {
  parse(componentsInfo: ComponentInfo[]) {
    const expressInfo: IExpressInfo = { routers: [] };

    componentsInfo.forEach(comp => {
      const ctrlOpenApi: IOpenAPIInfo = comp
        .getDecoratorsById(ExpressAnnotationId.OpenAPI)
        .find( x => !x.method)?.data;
      
      const middleware: IMiddlewareInfo[] = comp
        .getDecoratorsById(ExpressAnnotationId.UseMiddleware)
        .filter(deco => !deco.method)
        .map(deco => {
          const dependencyKey = deco.dependencies && deco.dependencies.length ? deco.dependencies[0].key : undefined;
          return { ...deco.data, dependencyKey };
        });

      const ctrlPath: string = comp.data?.path || '/';

      const routes = comp.getMethods()
        .map(method => {
          return this.getRouteInfo(comp, method);
        });

      expressInfo.routers.push({
        controllerInfo: comp,
        path: ctrlPath,
        openApi: ctrlOpenApi,
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
    
    const openApi: IOpenAPIInfo = decorators
      .find(deco => deco.id === ExpressAnnotationId.OpenAPI)?.data;
    
    const validation: IValidationSchema = decorators
      .find(deco => deco.id === ExpressAnnotationId.Validation)?.data;
    
    const fileUpload: IUploadInfo = decorators
      .find(deco => deco.id === ExpressAnnotationId.FileUpload)?.data;
    
    const middleware: IMiddlewareInfo[] = decorators
      .filter(deco => deco.id === ExpressAnnotationId.UseMiddleware)
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
      path: httpPath,
      middleware,
      inputs,
      fileUpload,
      validation,
      openApi
    };
  }
}