import { Config, ConfigManager } from '@nodearch/core';
import { IOpenAPIProviderConstructor } from '../interfaces';

@Config()
export class OpenAPIConfig {
  
  providers: IOpenAPIProviderConstructor[];

  constructor(config: ConfigManager) {
    this.providers = config.env({
      external: 'providers',
      defaults: {
        all: []
      }
    });
  }

}