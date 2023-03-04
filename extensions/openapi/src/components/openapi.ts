import { AppContext, Service } from '@nodearch/core';
import OAISchema from 'openapi3-ts';
import { OpenApiAnnotation } from '../index.js';
import { IOpenAPIAppMapItem, IOpenAPIProvider } from '../interfaces.js';
import { OpenAPIConfig } from './openapi.config.js';


@Service({ export: true })
export class OpenAPI {

  private providers: IOpenAPIProvider[] = [];
  private appMap: IOpenAPIAppMapItem[] = [];

  constructor(
    private readonly openAPIConfig: OpenAPIConfig,
    private readonly appContext: AppContext
  ) {
    this.providers = [];

    this.openAPIConfig.providers.forEach(provider => {
      const oaiProvider = this.appContext.container.get<IOpenAPIProvider>(provider);

      if (oaiProvider) {
        this.providers.push(oaiProvider);
      }
    });
  }

  get() {
    let openAPIObj: OAISchema.OpenAPIObject = this.getDefaults();

    this.providers.forEach(provider => {
      openAPIObj = Object.assign(openAPIObj, provider.getOpenAPI());

      if (provider.getAppMap) {
        this.setAppMapItems(provider.getAppMap());
      }
    });

    this.getDecoratorsDefinitions();

    return openAPIObj;
  }

  private getDefaults(): OAISchema.OpenAPIObject {
    return Object.assign({
      openapi: '3.0.0',
      info: {
        version: '0.1.0',
        title: 'NodeArch App',
        description: 'NodeArch Template App'
      },
      paths: {}
    }, this.openAPIConfig.openAPI);
  }

  private getDecoratorsDefinitions() {
    // this.appMap.map(x => {
    //   this.appContext.components.getComponents(OpenApiAnnotation.ResponseObject);
    //   x.
    // });

    const x = this.appContext.components.getComponents(OpenApiAnnotation.ResponseObject); 
    console.log('xxxxxxxxxx', x);
  }

  private setAppMapItems(appMap: IOpenAPIAppMapItem[]) {
    appMap.forEach(appMapItem => {
      
      const mapItemExist = this.appMap
        .find(
          currMapItem => currMapItem.component === appMapItem.component && 
          currMapItem.method === appMapItem.method
        );

      if (!mapItemExist) {
        this.appMap.push(appMapItem);
      }
    });
  }
}