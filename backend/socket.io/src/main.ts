import { App } from '@nodearch/core';
import path from 'path';
import { ISocketIOOptions } from './interfaces';


export class SocketIO extends App {
  constructor(options: ISocketIOOptions) {
    super({
      appInfo: {
        name: 'socket.io',
        version: '1.0.0'
      },
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      config: {
        externalConfig: options
      }
    });
  }
}