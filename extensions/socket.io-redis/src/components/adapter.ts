import { IAdapter } from '@nodearch/socket.io';
import { createAdapter, createShardedAdapter } from '@socket.io/redis-adapter';
import { AppContext, IExtensionProvider, Service } from '@nodearch/core';
import { AdapterConfig } from './adapter.config.js';


@Service({ export: true })
export class RedisAdapterProvider implements IAdapter, IExtensionProvider {
  constructor(
    private appContext: AppContext,
    private adapterConfig: AdapterConfig
  ) {}

  get() {
    const { redisClient } = this.adapterConfig;
    
    const redisProviderInstance = this.appContext
      .getContainer()
      .get(redisClient);

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
