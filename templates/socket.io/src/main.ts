import { App, LogLevel } from '@nodearch/core';
import { SocketIO, SocketIOServerProvider } from '@nodearch/socket.io';
import { SocketIOAdminUI, getSocketAdminUiUrl } from '@nodearch/socket.io-admin-ui';
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
        new SocketIOAdminUI({
          serverProvider: SocketIOServerProvider,
          enable: true
        }),
        new SocketIO({
          httpProvider: HttpServerProvider
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