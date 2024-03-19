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
          },
          ioOptions: {
            cors: {
              origin: ['https://admin.socket.io', 'https://firecamp.dev', 'https://amritb.github.io', 'http://localhost:3000'],
              credentials: true
            }
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