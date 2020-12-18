import { Service } from '@nodearch/core';
import { RoutesService } from '../routes.service';
import { ServerConfig } from '../server.config';
import {
  OpenAPIObject, InfoObject, PathsObject, PathInfo, OperationObject,
  ServerObject, SecurityRequirementObject, ComponentsObject, 
  TagObject, ExternalDocumentationObject
} from './openapi.interfaces';
import { IRouteInfo, IOpenAPIInfo } from '../../interfaces';
import { OpenAPIRequestBodyParser } from './body.parser';
import { OpenAPIParamsParser } from './param.parser';
import { OpenAPIResponseParser } from './response.parser';

@Service()
export class OpenAPIParser implements OpenAPIObject {
  openapi: string;
  info: InfoObject;
  servers: ServerObject[];
  paths: PathsObject;
  components: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags: TagObject[];
  externalDocs?: ExternalDocumentationObject;

  constructor(
    private readonly routesService: RoutesService,
    private readonly requestBodyParser: OpenAPIRequestBodyParser,
    private readonly responseParser: OpenAPIResponseParser,
    private readonly paramsParser: OpenAPIParamsParser,
    private readonly serverConfig: ServerConfig
  ) {
    this.openapi = '3.0.3';
    this.info = this.serverConfig.openAPIOptions.info;
    this.paths = {};
    this.tags = this.serverConfig.openAPIOptions.tags || [];
    this.servers = this.serverConfig.openAPIOptions.servers || [];
    this.components = { schemas: {}, securitySchemes: this.serverConfig.openAPIOptions.security?.securitySchemas };
    this.externalDocs = this.serverConfig.openAPIOptions.externalDocs;
  }

  parse(): OpenAPIObject {
    this.routesService.routesInfo.forEach(routeInfo => {
      if (routeInfo.openApiInfo?.enable) {
        const pathInfo = this.parsePath(routeInfo.httpInfo.httpPath);
        this.paths[pathInfo.path] = this.paths[pathInfo.path] || {};
        this.paths[pathInfo.path][routeInfo.httpInfo.httpMethod] = this.getOperationObject(routeInfo, pathInfo);
      }
    });

    return {
      openapi: this.openapi,
      info: this.info,
      servers: this.servers,
      paths: this.paths,
      components: this.components,
      security: this.security,
      tags: this.tags,
      externalDocs: this.externalDocs
    };
  }

  private getOperationObject(routeInfo: IRouteInfo, pathInfo: PathInfo): OperationObject {
    const { enable, ...operationOptions } = <IOpenAPIInfo> routeInfo.openApiInfo;
    const operation: OperationObject = {
      tags: ['default'], 
      responses: {},
      operationId: routeInfo.methodName
    };

    Object.assign(operation, operationOptions);

    this.addTags(operation.tags);
    this.paramsParser.parse(operation, pathInfo.params, routeInfo.validation);
    this.requestBodyParser.parse(operation, this.components, routeInfo.validation, routeInfo.fileUpload);
    this.responseParser.parse(operation, this.components);

    return operation;
  }

  private addTags(tags?: string[]) {
    tags?.forEach(methodTag => {
      const inTagExits = this.tags.findIndex(tag => tag.name === methodTag);

      if (inTagExits === -1) this.tags.push({ name: methodTag });
    });
  }

  private parsePath(url: string): PathInfo {
    const params: string[] = [];
    let path: string = '';

    if (url === '/') {
      return { path: url, params };
    }
    else {
      for (const urlPart of url.split('/')) {
        if (urlPart !== '') {
          if (urlPart.startsWith(':')) {
            const pathParam: string = urlPart.substring(1);
            params.push(pathParam);
            path = `${path}/{${pathParam}}`;
          }
          else {
            path = `${path}/${urlPart}`;
          }
        }
      }

      return { path, params };
    }
  }

}