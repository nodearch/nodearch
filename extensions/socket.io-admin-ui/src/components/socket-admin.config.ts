import { Config, ConfigManager } from '@nodearch/core';
import { AdminUIOptions, SocketIOAdminUIOptions } from '../interfaces.js';
import { ISocketIOServerProvider } from '@nodearch/socket.io';

@Config()
export class SocketIOAdminUIConfig implements SocketIOAdminUIOptions {
  serverProvider: ISocketIOServerProvider;
  options: AdminUIOptions;

  constructor(config: ConfigManager) {
    this.serverProvider = config.env({
      external: 'serverProvider'
    });
  
    this.options = config.env({
      external: 'options',
      defaults: {
        all: {
          auth: false
        }
      }
    });
  }
}