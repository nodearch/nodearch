import { Hook, IHook, Logger } from '@nodearch/core';
import { RedisClient } from './redis.service.js';

@Hook({ export: true })
export class RedisHook implements IHook {
  constructor(
    private redisClient: RedisClient,
    private logger: Logger
  ) {}

  async onStart() {
    try {
      await this.connectToRedis();
      this.logger.info('Connected to Redis');
    }
    catch(err) {
      this.logger.error('Failed to connect to Redis', err);
      throw err;
    }
  }

  private async connectToRedis() {
    await (new Promise((resolve, reject) => {
      const client = this.redisClient.get();
      
      client.on('error', (error) => {
        reject(error);
      });
      
      client.on('connect', () => {
        resolve(null);
      });
    
      client.on('ready', () => {
        resolve(null);
      });
    }));
  }
}