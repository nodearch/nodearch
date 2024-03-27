import { Config, ConfigManager } from '@nodearch/core';
import { RedisAdapterOptions } from '@socket.io/redis-adapter';
import { IRedisAdapterOptions, IRedisProvider } from '../interfaces.js';
import { ClassConstructor } from '@nodearch/core/utils';
import { ShardedRedisAdapterOptions } from '@socket.io/redis-adapter/dist/sharded-adapter.js';


@Config()
export class AdapterConfig implements IRedisAdapterOptions {
  redisProvider: ClassConstructor<IRedisProvider>;
  options?: Partial<RedisAdapterOptions>;
  shardedOptions?: ShardedRedisAdapterOptions;

  constructor(config: ConfigManager) {
    this.redisProvider = config.env({
      external: 'redisProvider'
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