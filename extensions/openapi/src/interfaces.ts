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
  getOpenAPI(): Partial<OAISchema.OpenAPIObject>;
  getAppMap?(): IOpenAPIAppMapItem[];
}

export type IOpenAPIProviderConstructor = ClassConstructor<IOpenAPIProvider>;

export enum OpenAPIFormat {
  Json = 'json',
  Yaml = 'yaml'
}

export interface IOpenAPICommandOptions {
  format: OpenAPIFormat;
  path?: string;
}

