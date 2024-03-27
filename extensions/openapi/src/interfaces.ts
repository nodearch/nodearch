import { ClassConstructor } from '@nodearch/core/utils';
import OAISchema from 'openapi3-ts';


export interface IOpenAPIAppOptions {
  providers?: IOpenAPIProviderConstructor[];
  openAPI?: Partial<OAISchema.OpenAPIObject>;
  format?: OpenAPIFormat;
  path?: string;
}

export interface IOpenAPIAppMapItem {
  component: ClassConstructor;
  method: string;
  httpPath: string;
  httpMethod: string;
}

export interface IOpenAPIProvider {
  get(): IOpenAPIProviderData;
}

export type IOpenAPIProviderData = {
  openapi?: string;
  info?: OAISchema.InfoObject;
  servers?: OAISchema.ServerObject[];
  components?: OAISchema.ComponentsObject;
  security?: OAISchema.SecurityRequirementObject[];
  tags?: OAISchema.TagObject[];
  externalDocs?: OAISchema.ExternalDocumentationObject;

  routes?: IOpenAPIAppRouteMap[];
  webhooks?: IOpenAPIAppRouteMap[];
};

export type IOpenAPIAppRouteMap = {
  app: {
    component: ClassConstructor;
    method: string;
  };
  schema: {
    path?: string;
    method?: string;
    data?: Partial<OAISchema.OperationObject>;
  };
};

export type IOpenAPIProviderConstructor = ClassConstructor<IOpenAPIProvider>;

export enum OpenAPIFormat {
  Json = 'json',
  Yaml = 'yaml'
}

export interface IOpenAPICommandOptions {
  format: OpenAPIFormat;
  path?: string;
}

