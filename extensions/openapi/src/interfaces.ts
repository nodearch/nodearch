import { ClassConstructor } from '@nodearch/core';

export interface IOpenAPIAppOptions {
  providers?: IOpenAPIProvider[];
}

export type IOpenAPIProvider = ClassConstructor<{}>;
