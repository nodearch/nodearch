import { Config, ConfigManager } from '@nodearch/core';
import io from 'socket.io';
import { NativeAdapter, Adapter } from '../interfaces';


@Config()
export class SocketIOConfig {
  ioServer: io.Server;
  sharedServer: boolean;
  adapters: (Adapter | NativeAdapter)[];

  constructor(config: ConfigManager) {
    
    this.ioServer = config.env({
      external: 'ioServer'
    });

    this.sharedServer = config.env({
      external: 'sharedServer'
    });

    this.adapters = config.env({
      defaults: { all: [] },
      external: 'adapters'
    });
    
  }
}