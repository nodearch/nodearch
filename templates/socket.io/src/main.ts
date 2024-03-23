import { App, LogLevel } from '@nodearch/core';
import { SocketIO, SocketIOServerProvider } from '@nodearch/socket.io';
import { RedisAdapterProvider, SocketIORedisAdapter } from '@nodearch/socket.io-redis';
import { IORedis, RedisClient } from '@nodearch/ioredis';
import { SocketIOAdminUI, getUiUrl } from '@nodearch/socket.io-admin-ui';
import { ExpressApp, HttpServerProvider } from '@nodearch/express';


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
        // new IORedis(),
        // new SocketIORedisAdapter({
        //   redisProvider: RedisClient
        // }),
        new ExpressApp({
          static: [
            {
              filePath: getUiUrl(),
              httpPath: '/io'
            }
          ]
        }),
        new SocketIO({
          httpProvider: HttpServerProvider,
          ioOptions: {
            cors: {
              origin: ['https://firecamp.dev']
            }
          }
          // adapter: RedisAdapterProvider
        }),
        new SocketIOAdminUI({
          serverProvider: SocketIOServerProvider,
          options: {
            auth: false,
            namespaceName: 'admin'
          },
          enable: true
        }),

      ]
    });
  }
}