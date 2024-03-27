import { AppContext, Service } from '@nodearch/core';
import * as utils from '@nodearch/core/utils';
import { ClassConstructor } from '@nodearch/core/utils';
import OAISchema, { OpenAPIObject } from 'openapi3-ts';
import { IOpenAPIAppMapItem, IOpenAPIAppRouteMap, IOpenAPIProvider, IOpenAPIProviderData } from '../interfaces.js';
import { OpenAPIConfig } from './openapi.config.js';
import { OAIBuiltInProvider } from './openapi.provider.js';


@Service({ export: true })
export class OpenAPI {

  private appMap: IOpenAPIAppMapItem[] = [];
  private openAPIObj: Partial<OAISchema.OpenAPIObject>;

  constructor(
    private readonly openAPIConfig: OpenAPIConfig,
    private readonly appContext: AppContext,
    private readonly oaiBuiltInProvider: OAIBuiltInProvider
  ) {
    this.openAPIObj = {};
  }

  // Get OpenAPI object
  get() {
    this.openAPIObj = this.getDefaults();

    // Create OAI providers list
    const providers: IOpenAPIProvider[] = [];

    // Add all custom providers
    this.openAPIConfig.providers.forEach(provider => {
      const oaiProvider = this.appContext.getContainer().get<IOpenAPIProvider>(provider);

      if (oaiProvider) {
        providers.push(oaiProvider);
      }
    });

    // Add the built-in provider at last because it should be able to override any other provider
    providers.push(this.oaiBuiltInProvider);

    // Get data from all providers
    const providersData = providers
      .map(provider => provider.get());

    // Populate app map which maps HTTP routes to app components/methods 
    this.populateAppMap(providersData);

    // Populate OpenAPI object with data from all providers
    this.populateProvidersData(providersData);

    return this.openAPIObj as OpenAPIObject;
  }

  // Populate App Map with Routes information
  private populateAppMap(providersData: IOpenAPIProviderData[]) {
    /**
     * At this stage we only need providers that have routes information to build the app map
     * 1. Filter out providers that don't have routes information
     * 2. Map providers to their routes (Only routes where path and method are defined)
     * 3. Flatten the array to get a single array of routes
     * 4. Populate our app map with routes information
     */
    providersData
      .filter(provider => provider.routes && provider.routes.length)
      .map(provider => provider.routes!.filter(route => route.schema.path && route.schema.method))
      .flat(1)
      .forEach(route => {

        this.appMap.push({
          component: route.app.component,
          method: route.app.method,
          httpMethod: route.schema.method!,
          httpPath: route.schema.path!
        })

      });
  }

  // Get default OpenAPI object
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

  // Populate OpenAPI object with data from all providers
  private populateProvidersData(providersData: IOpenAPIProviderData[]) {
    providersData.forEach(providerData => {
      const { routes, webhooks, ...data } = providerData;

      // This will merge everything except routes and webhooks
      for (const [key, value] of Object.entries(data)) {
        utils.set(this.openAPIObj, key, value);
      }

      // Populate OpenAPI object with data from routes
      if (routes) {
        routes.forEach(route => {
          const routeInfo = this.getRouteInfoByAppInfo(route.app.component, route.app.method);

          if (routeInfo) {
            this.populateRouteData(route, routeInfo);
          }
        });
      }
    });
  }

  // Get route information by app component and method
  private getRouteInfoByAppInfo(component: ClassConstructor, method: string) {
    return this.appMap.find(mapItem => mapItem.component === component && mapItem.method === method);
  }

  // Populate OpenAPI object with data from a single route
  private populateRouteData(route: IOpenAPIAppRouteMap, routeInfo: IOpenAPIAppMapItem) {
    const schemaPath = `paths.${routeInfo.httpPath}.${routeInfo.httpMethod}`;

    utils.set(
      this.openAPIObj, schemaPath, 
      utils.get(this.openAPIObj, schemaPath) || {}
    );

    if (route.schema.data) {
      for (const [key, value] of Object.entries(route.schema.data)) {
        const schemaPath = `paths.${routeInfo.httpPath}.${routeInfo.httpMethod}.${key}`;
        
        /**
         * If the key is parameters, we need to merge the parameters instead of replacing them
         * If utils.set is used directly in this case, it will just create duplicate parameters
         * TODO: Find a better way to merge parameters (Creating smarter utils.set??)
         */
        if (key === 'parameters') {
          const existingParameters = utils.get(this.openAPIObj, schemaPath);
          
          if (existingParameters) {

            value.forEach((parameter: any) => {
              const existingParameter = existingParameters.find((existingParameter: any) => {
                return existingParameter.name === parameter.name && existingParameter.in === parameter.in;
              });

              if (existingParameter) {
                Object.assign(existingParameter, parameter);
              }
              else {
                existingParameters.push(parameter);
              }
            });

          }
          else {
            utils.set(this.openAPIObj, schemaPath, value);
          }
        }
        else {
          utils.set(this.openAPIObj, schemaPath, value);
        }
      }
    }
  }
}