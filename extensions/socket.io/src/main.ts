import { App } from '@nodearch/core';
import { ISocketIOOptions } from './interfaces.js';


export class SocketIOApp extends App {
  constructor(options?: ISocketIOOptions) {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      config: options,
      logs: {
        prefix: 'Socket.IO'
      }
    });
  }
}
