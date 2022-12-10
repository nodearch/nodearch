import path from 'path';
import { App } from '@nodearch/core';
import { IOpenAPIAppOptions } from './interfaces';


export class OpenAPIApp extends App {
  constructor(config?: IOpenAPIAppOptions) {
    super({
      components: {
        path: path.join(__dirname, 'components')
      },
      config
    });
  }
}