import { Service } from '@nodearch/core';
import { IOpenAPIAppMapItem, IOpenAPIProvider, OAISchema } from '@nodearch/openapi';
import { OpenAPIParser } from './parser.js';

@Service({ export: true })
export class ExpressOAIProvider implements IOpenAPIProvider {
  constructor(
    private readonly openAPIParser: OpenAPIParser
  ) {}

  getOpenAPI() {
    return this.openAPIParser.parse();
  }

  getAppMap(): IOpenAPIAppMapItem[] {
    return this.openAPIParser.appMap;
  }
}