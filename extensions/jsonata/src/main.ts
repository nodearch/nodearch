import { App, ComponentScope } from '@nodearch/core';
import { IJsonataAppOptions } from './interfaces.js';


export class JsonataApp extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url),
        scope: ComponentScope.SINGLETON
      },
      logs: {
        prefix: `JSONata`
      },
      // config: options
    });
  }
}
