import path from 'path';
import { App } from '@nodearch/core';
import { IVaultOptions } from './interfaces';

export class Vault extends App {
  constructor(options?: IVaultOptions) {
    super({
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      externalConfig: options
    });
  }
}