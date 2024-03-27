import { Config, ConfigManager } from '@nodearch/core';
import { IHttpServerProvider, IServerSettings, ISocketAdapter, ISocketIOOptions } from '../interfaces.js';
import { ServerOptions } from 'socket.io';
import { ClassConstructor } from '@nodearch/core/utils';


@Config()
export class SocketConfig implements ISocketIOOptions {
  server: IServerSettings;
  httpServer?: ClassConstructor<IHttpServerProvider>;  
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

    this.httpServer = config.env({
      external: 'httpServer'
    });

    this.adapter = config.env({
      external: 'adapter'
    });

    this.ioOptions = config.env({
      external: 'ioOptions'
    });
  }
}