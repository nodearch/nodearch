import { Service } from '@nodearch/core';
import { IOpenAPIProvider, OpenAPIObject } from '@nodearch/openapi';

@Service({ export: true })
export class ExpressOAIProvider implements IOpenAPIProvider {
  get(): Partial<OpenAPIObject> {
    return {
      info: {
        title: 'this is from express',
        version: '1'
      }
    };
  }
}