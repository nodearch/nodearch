import { ComponentInfo, Service } from '@nodearch/core';
import { IExpressInfo, IExpressMiddleware, IExpressRoute } from './interfaces';
import { ExpressAnnotationId } from './enums';
import { IOpenAPIInfo } from '../openapi/interfaces';
import { IValidationSchema } from '../validation/interfaces';
import { IUploadInfo } from '../upload/interfaces';


@Service()
export class ExpressService {

  expressInfo: IExpressInfo;

  constructor() {
    this.expressInfo = { routers: [] };
  }

  init(componentsInfo: ComponentInfo[]) {

    componentsInfo.forEach(comp => {
      const ctrlOpenApi: IOpenAPIInfo = comp.getDecoratorsById(ExpressAnnotationId.OpenAPI).find( x => !x.method)?.data;
      const middleware: IExpressMiddleware[] = comp.getDecoratorsById(ExpressAnnotationId.Middleware).filter( x => !x.method).map(x => x.data);
      const ctrlPath: string = comp.data?.path || '/';

      const routes = comp.getMethods()
        .map(method => {
          return this.getRouteInfo(comp, method);
        });

      this.expressInfo.routers.push({
        path: ctrlPath,
        openApi: ctrlOpenApi,
        middleware,
        routes
      });
    });

  }

  private getRouteInfo(componentInfo: ComponentInfo, method: string): IExpressRoute {
    const decorators = componentInfo.getDecoratorsByMethod(method);

    const { httpPath, httpMethod } = decorators.find(deco => deco.id === ExpressAnnotationId.HttpMethod)?.data;
    const openApi: IOpenAPIInfo = decorators.find(deco => deco.id === ExpressAnnotationId.OpenAPI)?.data;
    const validation: IValidationSchema = decorators.find(deco => deco.id === ExpressAnnotationId.Validation)?.data;
    const upload: IUploadInfo = decorators.find(deco => deco.id === ExpressAnnotationId.Upload)?.data;
    const middleware: IExpressMiddleware[] = decorators.filter(deco => deco.id === ExpressAnnotationId.UseMiddleware).map(x => x.data);

    return {
      method: httpMethod,
      path: httpPath,
      middleware,
      upload,
      validation,
      openApi
    };

  }

}