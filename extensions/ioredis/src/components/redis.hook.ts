import { Hook, IHook, Logger } from '@nodearch/core';
import { RedisClient } from './redis.service.js';


@Hook({ export: true })
export class RedisHook implements IHook {
  constructor(
    private redisClient: RedisClient,
    private logger: Logger
  ) {}

  async onStart() {
    await this.connectToRedis();
  }

  private async connectToRedis() {
    const client = this.redisClient.get();

    try {
      this.logger.info('Connecting to Redis...');
      await client.ping();
      this.logger.info('Connected to Redis');
    }
    catch(err) {
      this.logger.error('Failed to connect to Redis', err); 
      throw err;
    }
  }
}