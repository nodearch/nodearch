import { App, LogLevel } from '@nodearch/core';
import { SocketIO, SocketIOServerProvider } from '@nodearch/socket.io';
import { RedisAdapterProvider, SocketIORedisAdapter } from '@nodearch/socket.io-redis';
import { IORedis, RedisClient } from '@nodearch/ioredis';
import { SocketIOAdminUI, getUiUrl } from '@nodearch/socket.io-admin-ui';
import { ExpressApp } from '@nodearch/express';


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
        new SocketIOAdminUI({
          serverProvider: SocketIOServerProvider,
          options: {
            auth: false,
            namespaceName: 'admin'
          },
          enable: true,
          serve: true
        }),
        // new ExpressApp({
        //   static: [
        //     {
        //       filePath: getUiUrl(),
        //       httpPath: '/io'
        //     }
        //   ]
        // })
      ]
    });
  }
}

/**
 * TODO: 
 * 2. AdminUI EXT
 * 3. pass http server as option 
 */