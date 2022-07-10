import path from 'path';
import { App } from '@nodearch/core';
import { IVaultOptions } from './interfaces';
const pkg = require('../package.json');

export class Vault extends App {
  constructor(options?: IVaultOptions) {
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