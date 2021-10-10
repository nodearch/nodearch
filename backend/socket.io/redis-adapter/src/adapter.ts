import { Adapter } from '@nodearch/socket.io';
import { createAdapter, RedisAdapterOptions } from '@socket.io/redis-adapter';
import { IRedisProvider, IRedisProviderInstance } from './interfaces';


export function redisAdapter(redisProvider: IRedisProvider, opts?: Partial<RedisAdapterOptions>) {
  return {
    getAdapter: (getComponent) => {
      const redisProviderInstance = getComponent<IRedisProviderInstance>(redisProvider);
      const pubClient = redisProviderInstance.getClient();
      const subClient = pubClient.duplicate();
      return createAdapter(pubClient, subClient, opts);
    }
  } as Adapter;
}