import { Config, ConfigManager } from '@nodearch/core';
import { RedisOptions } from 'ioredis';

@Config()
export class RedisConfig {
  options?: RedisOptions;

  constructor(config: ConfigManager) {
    this.options = config.env({
      external: 'options'
    });
  }
}