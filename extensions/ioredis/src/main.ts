import { App, ComponentScope } from '@nodearch/core';
import { RedisOptions } from 'ioredis';


export class IORedis extends App {
  constructor(options?: RedisOptions) {
    super({
      components: {
        url: new URL('components', import.meta.url),
        scope: ComponentScope.SINGLETON
      },
      config: { options },
      logs: {
        prefix: 'IO Redis'
      }
    });
  }
}
