import { App } from '@nodearch/core';


export class LambdaApp extends App {
  constructor(options?: any) {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      config: options,
      logs: {
        prefix: 'Lambda'
      }
    });
  }
}