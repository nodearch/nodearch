import { App } from '@nodearch/core';
import path from 'path';
import { IExpressServerOptions } from './interfaces';


export class ExpressServer extends App {
  constructor(options: IExpressServerOptions) {
    super({
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      externalConfig: options
    });
  }
}
