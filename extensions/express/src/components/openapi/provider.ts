import { Service, IExtensionProvider } from '@nodearch/core';
import { IOpenAPIProvider } from '@nodearch/openapi';
import { OpenAPIParser } from './parser.js';

@Service({ export: true })
export class ExpressOAIProvider implements IOpenAPIProvider, IExtensionProvider {
  constructor(
    private readonly openAPIParser: OpenAPIParser
  ) {}

  get() {
    return this.openAPIParser.parse();
  }
}