import { Service } from '@nodearch/core';
import { ControllerMetadata } from '../../metadata';
import { ServerConfig } from '../server.config';
import { IOpenAPIInfo } from '../../interfaces';
import { SecuritySchemeObject, ScopesObject } from './openapi.interfaces';

@Service()
export class OpenAPIService {
  constructor(private readonly serverConfig: ServerConfig) {}

  getOpenApiInfo(controller: any, method: any): IOpenAPIInfo | undefined {
    const controllerRoutesOpenAPIs = ControllerMetadata.getOpenApiInfo(controller.constructor);
    const sharedOpenAPI = controllerRoutesOpenAPIs.find(openApi => !openApi.method);
    const methodOpenAPI = controllerRoutesOpenAPIs.find(openApi => openApi.method === method);
    const routeOpenAPI: IOpenAPIInfo = Object.assign({}, sharedOpenAPI?.openAPIInfo||{}, methodOpenAPI?.openAPIInfo||{});

    if (routeOpenAPI) {
      if (!routeOpenAPI.hasOwnProperty('enable')) {
        routeOpenAPI.enable = this.serverConfig.openAPIOptions.enableAllRoutes;
      }

      if (routeOpenAPI.enable) this.parseRouteSecurity(routeOpenAPI);
    }

    return routeOpenAPI;
  }

  private parseRouteSecurity(routeOpenAPI: IOpenAPIInfo) {
    if (
      !routeOpenAPI.security && 
      this.serverConfig.openAPIOptions.security?.enableAllRoutes &&
      this.serverConfig.openAPIOptions.security.securitySchemas
    ) {
      routeOpenAPI.security = [];
      const { securitySchemas } = this.serverConfig.openAPIOptions.security;

      for (const securityKey in securitySchemas) {
        const { flows } = (<SecuritySchemeObject> securitySchemas[securityKey]);
        const scopes: ScopesObject = flows?.authorizationCode?.scopes || 
          flows?.clientCredentials?.scopes ||
          flows?.implicit?.scopes ||
          flows?.password?.scopes || 
          {};

        routeOpenAPI.security.push({ [securityKey]: Object.keys(scopes) });
      }
    }
  }
}