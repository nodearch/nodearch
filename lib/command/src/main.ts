import { App } from '@nodearch/core';
import { ICommandAppOptions } from './components/interfaces.js';


export class CommandApp extends App {
  constructor(config: ICommandAppOptions) {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      config
    });
  }
}