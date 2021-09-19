import { Config, ConfigManager } from '@nodearch/core';
import io from 'socket.io';


@Config()
export class SocketIOConfig {
  ioServer: io.Server;
  sharedServer: boolean;

  constructor(config: ConfigManager) {
    
    this.ioServer = config.env({
      external: 'ioServer'
    });

    this.sharedServer = config.env({
      external: 'sharedServer'
    });
    
  }
}