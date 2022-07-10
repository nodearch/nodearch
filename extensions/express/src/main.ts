import { App } from '@nodearch/core';
import path from 'path';
import { IExpressServerOptions } from './interfaces';
const pkg = require('../package.json');


export class ExpressServer extends App {
  constructor(options: IExpressServerOptions) {
    super({
      appInfo: {
        name: pkg.name,
        version: pkg.version
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
