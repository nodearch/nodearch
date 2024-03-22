import { ClassConstructor } from '@nodearch/core/utils';
import { RedisAdapterOptions } from '@socket.io/redis-adapter';

export interface IRedisProvider {
  getClient(): any;
}

export interface IRedisAdapterOptions {
  redisProvider: ClassConstructor<IRedisProvider>;
  options?: RedisAdapterOptions;
  shardedAdapter?: boolean;
}