import { Config, ConfigManager, IExtensionProviderComponent } from '@nodearch/core';
import { RedisAdapterOptions } from '@socket.io/redis-adapter';
import { IRedisAdapterOptions } from '../interfaces.js';
import { ClassConstructor } from '@nodearch/core/utils';
import { ShardedRedisAdapterOptions } from '@socket.io/redis-adapter/dist/sharded-adapter.js';


@Config()
export class AdapterConfig implements IRedisAdapterOptions {
  redisClient: IExtensionProviderComponent;
  options?: Partial<RedisAdapterOptions>;
  shardedOptions?: ShardedRedisAdapterOptions;

  constructor(config: ConfigManager) {
    this.redisClient = config.env({
      external: 'redisClient'
    });

    this.options = config.env({
      external: 'options'
    });

    this.shardedOptions = config.env({
      external: 'shardedOptions'
    });

    if (this.options && this.shardedOptions) {
      throw new Error('Both options and shardedOptions cannot be provided at the same time to the redis socket.io adapter');
    }
  }  
}