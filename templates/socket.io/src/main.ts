import { App, LogLevel } from '@nodearch/core';
import { SocketIO } from '@nodearch/socket.io';
import { RedisAdapterProvider, SocketIORedisAdapter } from '@nodearch/socket.io-redis';
import { IORedis, RedisClient } from '@nodearch/ioredis';
// import { SocketIOAdminUIApp } from '@nodearch/socket.io-admin-ui';


export default class SocketIOTemplate extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      logs: {
        logLevel: LogLevel.Debug,
        prefix: 'SocketIO App'
      },
      extensions: [
        new IORedis(),
        new SocketIORedisAdapter({
          redisProvider: RedisClient
        }),
        new SocketIO({
          server: {
            hostname: 'localhost',
            port: 4000
          },
          adapter: RedisAdapterProvider
        }),
        // new SocketIOAdminUIApp({
        //   serverProvider: SocketIOServerProvider,
        //   options: {
        //     auth: false
        //   }
        // })
      ]
    });
  }
}

/**
 * TODO: 
 * 1. Redis EXT
 * 2. AdminUI EXT
 * 3. pass http server as option 
 */