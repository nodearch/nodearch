import { AppContext, Service } from '@nodearch/core';
import * as utils from '@nodearch/core/utils';
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
      console.log(openAPIObj);
      if (provider.getAppMap) {
        this.setAppMapItems(provider.getAppMap());
      }
    });

    this.setDecoratorsData(
      openAPIObj, 
      OpenApiAnnotation.Responses, 
      (mapItem?: IOpenAPIAppMapItem) => {
        return mapItem && `paths.${mapItem!.httpPath}.${mapItem!.httpMethod}.responses`;
      }
    );

    this.setDecoratorsData(
      openAPIObj, 
      OpenApiAnnotation.Tags, 
      (mapItem?: IOpenAPIAppMapItem) => {
        return mapItem && `paths.${mapItem!.httpPath}.${mapItem!.httpMethod}.tags`;
      }
    );

    this.setDecoratorsData(
      openAPIObj, 
      OpenApiAnnotation.Servers, 
      () => {
        return `servers`;
      }
    );

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

  private setDecoratorsData(openAPIObj: OAISchema.OpenAPIObject, decoId: string, getPath: (mapItem?: IOpenAPIAppMapItem) => string | undefined) {
    this.getDecoratorsDefinitions(decoId)
      .forEach(decoData => {
        let mapItem: IOpenAPIAppMapItem | undefined;

        if (decoData.method) {
          mapItem = this.appMap
            .find(
              mapItem => mapItem.component === decoData.component && 
                mapItem.method === decoData.method
            );
        }
        
        const objPath = getPath(mapItem);
          
        if (objPath) {
          utils.set(openAPIObj, objPath, decoData.data);
        }

      });
  }

  private getDecoratorsDefinitions(id: string) {
    return this.appContext
      .components
      .getDecoratorsById(id)
      .map(decoInfo => {
        return {
          component: decoInfo.componentInfo.getClass(),
          method: decoInfo.method,
          data: decoInfo.data
        };
      }); 
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