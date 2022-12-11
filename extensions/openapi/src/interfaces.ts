import { ClassConstructor } from '@nodearch/core';
import { OpenAPIObject } from 'openapi3-ts';

export interface IOpenAPIAppOptions {
  providers?: IOpenAPIProviderConstructor[];
}

export interface IOpenAPIProvider {
  get(): Partial<OpenAPIObject>;
}

export type IOpenAPIProviderConstructor = ClassConstructor<IOpenAPIProvider>;