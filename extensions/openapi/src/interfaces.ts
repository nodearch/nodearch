import { ClassConstructor } from '@nodearch/core';
import { OpenAPIObject } from 'openapi3-ts';

export interface IOpenAPIAppOptions {
  providers?: IOpenAPIProviderConstructor[];
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