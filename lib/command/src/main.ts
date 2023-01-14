import { App } from '@nodearch/core';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { ICommandAppOptions } from './components/interfaces.js';


export class CommandApp extends App {
  constructor(config: ICommandAppOptions) {
    super({
      components: {
        path: path.join(fileURLToPath(new URL('.', import.meta.url)), 'components')
      },
      config
    });
  }
}