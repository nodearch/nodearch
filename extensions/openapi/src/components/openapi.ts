import { Service } from '@nodearch/core';
import { OpenAPIConfig } from './openapi.config';


@Service({ export: true })
export class OpenAPI {

  constructor(
    private readonly openAPIConfig: OpenAPIConfig
  ) {}

  get() {
    return { something: 'something' };
  }
}