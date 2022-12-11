import { ClassConstructor } from '@nodearch/core';
import { OpenAPI } from '@nodearch/openapi';

export interface SwaggerAppOptions {
  openAPI: ClassConstructor<OpenAPI>;
}