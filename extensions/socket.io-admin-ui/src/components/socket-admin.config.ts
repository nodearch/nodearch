import { Config, ConfigManager } from '@nodearch/core';
import { AdminUIOptions, SocketIOAdminUIOptions } from '../interfaces.js';
import { ISocketIOServerProvider } from '@nodearch/socket.io';

@Config()
export class SocketIOAdminUIConfig implements SocketIOAdminUIOptions {
  serverProvider: ISocketIOServerProvider;
  options: AdminUIOptions;
  enable: boolean;
  serve: boolean;
  url: string;

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

    this.enable = config.env({
      external: 'enable',
      defaults: {
        all: false
      }
    });

    this.serve = config.env({
      external: 'serve',
      defaults: {
        all: false
      }
    });

    this.url = config.env({
      external: 'url',
      defaults: {
        all: '/socket-admin'
      }
    });
  }
}