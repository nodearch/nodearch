import { Service } from '@nodearch/core';
import io from 'socket.io';
import { SocketIOConfig } from './socketio.config';


@Service()
export class IO {
  server: io.Server;

  constructor(socketIOConfig: SocketIOConfig) {
    this.server = socketIOConfig.ioServer;
  }
}