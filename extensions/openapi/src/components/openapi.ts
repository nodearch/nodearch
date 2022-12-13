import { Service } from '@nodearch/core';
import { OpenAPIObject } from 'openapi3-ts';
import { IOpenAPIAppMapItem, IOpenAPIProvider } from '../interfaces';
import { OpenAPIConfig } from './openapi.config';


@Service({ export: true })
export class OpenAPI {

  private providers: IOpenAPIProvider[] = [];
  private appMap: IOpenAPIAppMapItem[] = [];

  constructor(
    private readonly openAPIConfig: OpenAPIConfig
  ) {}

  init(providers: IOpenAPIProvider[]) {
    this.providers = providers; 
  }

  get() {
    let openAPIObj: Partial<OpenAPIObject> = this.getDefaults();

    this.providers.forEach(provider => {
      openAPIObj = Object.assign(openAPIObj, provider.getOpenAPI());

      if (provider.getAppMap) {
        this.setAppMapItems(provider.getAppMap());
      }
    });

    return openAPIObj;
  }

  private getDefaults(): Partial<OpenAPIObject> {
    return Object.assign({
      openapi: '3.0.0',
      info: {
        version: '0.1.0',
        title: 'NodeArch App',
        description: 'NodeArch Template App'
      }
    }, this.openAPIConfig.openAPI);
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