import { App } from '@nodearch/core';
import { IJoiAppOptions } from './interfaces.js';


export class JoiApp extends App {
  constructor(config?: IJoiAppOptions) {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      config
    });
  }
}