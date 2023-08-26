import path from 'path';
import { App } from '@nodearch/core';
import { IVaultOptions } from './interfaces.js';
const pkg = require('../package.json');

export class Vault extends App {
  constructor(options?: IVaultOptions) {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      config: options
    });
  }
}