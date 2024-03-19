import { App, ComponentScope, LogLevel } from '@nodearch/core';
import { SocketIO, SocketIOServerProvider } from '@nodearch/socket.io';
// import { SocketIOAdminUIApp } from '@nodearch/socket.io-admin-ui';


export default class SocketIOTemplate extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      logs: {
        logLevel: LogLevel.Debug,
        prefix: 'SocketIOTemplate'
      },
      extensions: [
        new SocketIO({
          server: {
            hostname: 'localhost',
            port: 4000
          }
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