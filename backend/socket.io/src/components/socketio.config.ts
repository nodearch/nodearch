import { Config, ConfigManager } from '@nodearch/core';
import io from 'socket.io';
import http from 'http';
import https from 'https';


@Config()
export class SocketIOConfig {
  ioServer: io.Server;

  constructor(config: ConfigManager) {
    
    this.ioServer = config.env({
      external: 'ioServer'
    });
    
  }
}