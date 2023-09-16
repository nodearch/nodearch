import { App, LogLevel } from '@nodearch/core';
import { SocketIOApp } from '@nodearch/socket.io';


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
        new SocketIOApp()
      ]
    });
  }
}