import { Config, ConfigManager } from '@nodearch/core';
import { OpenAPIObject } from 'openapi3-ts';
import { IOpenAPIProviderConstructor } from '../interfaces';

@Config()
export class OpenAPIConfig {
  
  providers: IOpenAPIProviderConstructor[];
  openAPI?: Partial<OpenAPIObject>; 

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
  }

}