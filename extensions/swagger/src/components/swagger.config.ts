import { Config, ConfigManager } from '@nodearch/core';

@Config()
export class SwaggerConfig {
  
  url: string;

  constructor(config: ConfigManager) {
    this.url = config.env({
      external: 'url'
    });
  }
}