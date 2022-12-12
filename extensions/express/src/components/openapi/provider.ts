import { Service } from '@nodearch/core';
import { IOpenAPIProvider } from '@nodearch/openapi';
import { OpenAPIParser } from './parser';

@Service({ export: true })
export class ExpressOAIProvider implements IOpenAPIProvider {
  constructor(
    private readonly openAPIParser: OpenAPIParser
  ) {}

  get() {
    return this.openAPIParser.parse();
  }
}