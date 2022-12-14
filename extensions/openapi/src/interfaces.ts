import { ClassConstructor } from '@nodearch/core';
import { OpenAPIObject } from 'openapi3-ts';

export interface IOpenAPIAppOptions {
  providers?: IOpenAPIProviderConstructor[];
  openAPI?: Partial<OpenAPIObject>;
}

export interface IOpenAPIAppMapItem {
  component: ClassConstructor;
  method: string;
  httpPath: string;
  httpMethod: string;
}

export interface IOpenAPIProvider {
  getOpenAPI(): Partial<OpenAPIObject>;
  getAppMap?(): IOpenAPIAppMapItem[];
}

export type IOpenAPIProviderConstructor = ClassConstructor<IOpenAPIProvider>;

export interface IOpenAPICommandOptions {
  format: ('json' | 'yaml');
}