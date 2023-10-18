import { App } from '@nodearch/core';
import { IVaultOptions } from './interfaces.js';


export class VayltApp extends App {
  constructor(config?: IVaultOptions) {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      config
    });
  }
}