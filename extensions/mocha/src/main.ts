import { App } from '@nodearch/core';


export class MochaApp extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      }
    });
  }
}
