import { Service } from '@nodearch/core';
import { IOpenAPIProvider } from '@nodearch/openapi';
import { OpenAPIParser } from './parser.js';

@Service({ export: true })
export class ExpressOAIProvider implements IOpenAPIProvider {
  constructor(
    private readonly openAPIParser: OpenAPIParser
  ) {}

  getData() {
    return this.openAPIParser.parse();
  }
}