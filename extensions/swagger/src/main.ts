import { App } from '@nodearch/core';
import { SwaggerAppOptions } from './interfaces.js';


export class SwaggerApp extends App{
  constructor(config: SwaggerAppOptions) {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      config
    });
  }
}