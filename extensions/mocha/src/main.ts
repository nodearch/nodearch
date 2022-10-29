import { App } from '@nodearch/core';
import path from 'path';
import { IMochaOptions } from './interfaces';


export class Mocha extends App {
  constructor(options?: IMochaOptions) {
    super({
      components: {
        path: path.join(__dirname, 'components')
      },
      config: options
    });
  }
}