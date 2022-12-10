import { Config, ConfigManager } from '@nodearch/core';
import { IOpenAPIProvider } from '../interfaces';

@Config()
export class OpenAPIConfig {
  
  providers: IOpenAPIProvider[];

  constructor(config: ConfigManager) {
    this.providers = config.env({
      external: 'providers',
      defaults: {
        all: []
      }
    });
  }

}