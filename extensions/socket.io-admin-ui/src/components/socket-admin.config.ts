import { Config, ConfigManager } from '@nodearch/core';
import { AdminUIOptions, SocketIOAdminUIOptions } from '../interfaces.js';
import { ISocketIOServerProvider } from '@nodearch/socket.io';

@Config()
export class SocketIOAdminUIConfig implements SocketIOAdminUIOptions {
  server: ISocketIOServerProvider;
  options: AdminUIOptions;
  enable: boolean;

  constructor(config: ConfigManager) {
    this.server = config.env({
      external: 'server'
    });
  
    this.options = config.env({
      external: 'options',
      defaults: {
        all: {
          auth: false
        }
      }
    });

    this.enable = config.env({
      external: 'enable',
      defaults: {
        all: false
      }
    });
  }
}