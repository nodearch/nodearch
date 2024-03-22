import { Config, ConfigManager } from '@nodearch/core';
import { RedisAdapterOptions } from '@socket.io/redis-adapter';
import { IRedisAdapterOptions, IRedisProvider } from './interfaces.js';
import { ClassConstructor } from '@nodearch/core/utils';


@Config()
export class AdapterConfig implements IRedisAdapterOptions {
  redisProvider: ClassConstructor<IRedisProvider>;
  options?: RedisAdapterOptions;
  shardedAdapter?: boolean;

  constructor(config: ConfigManager) {
    this.redisProvider = config.env({
      external: 'redisProvider'
    });

    this.options = config.env({
      external: 'options'
    });

    this.shardedAdapter = config.env({
      external: 'shardedAdapter'
    });
  }  
}