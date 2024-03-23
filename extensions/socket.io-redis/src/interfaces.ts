import { ClassConstructor } from '@nodearch/core/utils';
import { RedisAdapterOptions } from '@socket.io/redis-adapter';
import { ShardedRedisAdapterOptions } from '@socket.io/redis-adapter/dist/sharded-adapter.js';

export interface IRedisProvider {
  get(): any;
}

export interface IRedisAdapterOptions {
  redisProvider: ClassConstructor<IRedisProvider>;
  options?: RedisAdapterOptions;
  shardedOptions?: ShardedRedisAdapterOptions;
}