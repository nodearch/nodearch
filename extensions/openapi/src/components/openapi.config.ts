import { Config, ConfigManager } from '@nodearch/core';
import { OpenAPIObject } from 'openapi3-ts';
import { IOpenAPIProviderConstructor, OpenAPIFormat } from '../interfaces';

@Config()
export class OpenAPIConfig {
  
  providers: IOpenAPIProviderConstructor[];
  openAPI?: Partial<OpenAPIObject>;
  format?: OpenAPIFormat;
  path?: string;

  constructor(config: ConfigManager) {
    this.providers = config.env({
      external: 'providers',
      defaults: {
        all: []
      }
    });

    this.openAPI = config.env({
      external: 'openAPI',
      required: false
    });

    this.format = config.env({
      external: 'format',
      required: false
    });

    this.path = config.env({
      external: 'path',
      required: false
    });
  }

}