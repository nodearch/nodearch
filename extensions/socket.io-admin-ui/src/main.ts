import { App } from '@nodearch/core';
import { SocketIOAdminUIOptions } from './interfaces.js';


export class SocketIOAdminUIApp extends App {
  constructor(options: SocketIOAdminUIOptions) {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      config: options,
      logs: {
        prefix: 'Socket.IO - Admin UI'
      }
    });
  }
}
