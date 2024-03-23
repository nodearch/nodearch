import { IAdapter } from '@nodearch/socket.io';
import { createAdapter, createShardedAdapter } from '@socket.io/redis-adapter';
import { IRedisProvider } from '../interfaces.js';
import { AppContext, Service } from '@nodearch/core';
import { AdapterConfig } from './adapter.config.js';


@Service({ export: true })
export class RedisAdapterProvider implements IAdapter {
  constructor(
    private appContext: AppContext,
    private adapterConfig: AdapterConfig
  ) {}

  get() {
    const { redisProvider } = this.adapterConfig;
    
    const redisProviderInstance = this.appContext
      .getContainer()
      .get<IRedisProvider>(redisProvider);

    if (!redisProviderInstance) {
      throw new Error('Redis provider is not found');
    }

    const pubClient = redisProviderInstance.get();

    const subClient = pubClient.duplicate();
    
    if (this.adapterConfig.shardedOptions) {
      return createShardedAdapter(pubClient, subClient, this.adapterConfig.shardedOptions) as any;
    }
    else {
      return createAdapter(pubClient, subClient, this.adapterConfig.options);
    }
  }
}
