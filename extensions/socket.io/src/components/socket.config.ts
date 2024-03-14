import { Config, ConfigManager } from '@nodearch/core';
import { IServerSettings, ISocketAppAdapter, ISocketIOOptions } from '../interfaces.js';
import { ServerOptions } from 'socket.io';


@Config()
export class SocketConfig implements ISocketIOOptions {
  server: IServerSettings;
  adapters?: ISocketAppAdapter[];
  ioOptions?: Partial<ServerOptions>;

  constructor(config: ConfigManager) {
    this.server = config.env({
      external: 'server',
      defaults: {
        all: {
          port: 3000,
          hostname: 'localhost'
        }
      }
    });

    this.adapters = config.env({
      external: 'adapters'
    });

    this.ioOptions = config.env({
      external: 'ioOptions'
    });
  }
}