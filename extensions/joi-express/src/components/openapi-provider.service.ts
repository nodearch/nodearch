import { AppContext, Service } from '@nodearch/core';
import { IOpenAPIProvider, IOpenAPIProviderData } from '@nodearch/openapi';
import { ValidationMiddleware } from './validation.middleware.js';
import { ExpressDecorator } from '@nodearch/express';
import { JoiOpenApiService } from './joi-openapi.service.js';


@Service({ export: true })
export class JoiOpenApiProvider implements IOpenAPIProvider {

  constructor(
    private readonly appContext: AppContext,
    private readonly joiOpenApiService: JoiOpenApiService
  ) { }

  getData(): IOpenAPIProviderData {

    const useMiddleware = this.appContext.getComponentRegistry().getDecorators({ useId: ExpressDecorator.MIDDLEWARE });

    const useDecorators = useMiddleware.filter(decorator => decorator.data.component === ValidationMiddleware);

    const routes = useDecorators
      .filter(decorator => decorator.method)
      .map(decorator => {
        return {
          app: {
            component: decorator.componentInfo.getClass(),
            method: decorator.method as string
          },
          schema: {
            data: this.joiOpenApiService.getRouteInfo(decorator.data.options)
          }
        };
      });


    return {
      routes
    };
  }

}