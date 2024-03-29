import { App, LogLevel } from '@nodearch/core';
import { SocketIOApp, SocketIOServerProvider } from '@nodearch/socket.io';
import { SocketIOAdminUIApp, getSocketAdminUiUrl } from '@nodearch/socket.io-admin-ui';
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
        new SocketIOAdminUIApp({
          server: SocketIOServerProvider,
          enable: true
        }),
        new SocketIOApp({
          httpServer: HttpServerProvider
        }),
        new ExpressApp({
          static: [
            {
              filePath: getSocketAdminUiUrl(),
              httpPath: '/socket-admin'
            }
          ]
        })
      ]
    });
  }
}