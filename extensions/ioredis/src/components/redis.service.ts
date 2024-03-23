import { Service } from '@nodearch/core';
import { Redis } from 'ioredis';
import { RedisConfig } from './redis.config.js';

@Service({ export: true })
export class RedisClient {

  private client: Redis;

  constructor(redisConfig: RedisConfig) {
    this.client = redisConfig.options ? new Redis(redisConfig.options) : new Redis();
  }

  get() {
    return this.client;
  }
}