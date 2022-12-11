import { ClassConstructor, Config, ConfigManager } from '@nodearch/core';
import { OpenAPI } from '@nodearch/openapi';

@Config()
export class SwaggerConfig {
  
  openAPI: ClassConstructor<OpenAPI>;

  constructor(config: ConfigManager) {
    this.openAPI = config.env({
      external: 'openAPI'
    });
  }
}