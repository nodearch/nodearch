import { IExtensionProviderComponent } from '@nodearch/core';
import { ClassConstructor } from '@nodearch/core/utils';
import { RedisAdapterOptions } from '@socket.io/redis-adapter';
import { ShardedRedisAdapterOptions } from '@socket.io/redis-adapter/dist/sharded-adapter.js';


export interface IRedisAdapterOptions {
  redisClient: IExtensionProviderComponent;
  options?: Partial<RedisAdapterOptions>;
  shardedOptions?: ShardedRedisAdapterOptions;
}