import { App } from '@nodearch/core';
import path from 'path';
import { ISocketIOOptions } from './interfaces';


export class SocketIO extends App {
  constructor(options: ISocketIOOptions) {
    super({
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      externalConfig: options
    });
  }
}