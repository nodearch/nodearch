import { Adapter } from '@nodearch/socket.io';
import { createAdapter, RedisAdapterOptions } from '@socket.io/redis-adapter';
import { ClassConstructor } from '@nodearch/core';
import { IRedisProvider } from './interfaces';


export function redisAdapter(redisProvider: ClassConstructor<IRedisProvider>, opts?: Partial<RedisAdapterOptions>) {
  return {
    getAdapter: (getComponent) => {
      const redisProviderInstance = getComponent<IRedisProvider>(redisProvider);
      const pubClient = redisProviderInstance.getClient();
      const subClient = pubClient.duplicate();
      return createAdapter(pubClient, subClient, opts);
    }
  } as Adapter;
}