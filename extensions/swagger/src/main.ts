import { App } from '@nodearch/core';
import path from 'path';
import { SwaggerAppOptions } from './interfaces';


export class SwaggerApp extends App{
  constructor(config: SwaggerAppOptions) {
    super({
      components: {
        path: path.join(__dirname, 'components')
      },
      config
    });
  }
}