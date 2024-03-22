import { Config, ConfigManager } from '@nodearch/core';
import { IServerSettings, ISocketAdapter, ISocketIOOptions } from '../interfaces.js';
import { ServerOptions } from 'socket.io';


@Config()
export class SocketConfig implements ISocketIOOptions {
  server: IServerSettings;
  adapter?: ISocketAdapter;
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

    this.adapter = config.env({
      external: 'adapter'
    });

    this.ioOptions = config.env({
      external: 'ioOptions'
    });
  }
}