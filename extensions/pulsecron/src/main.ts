import { App } from '@nodearch/core';
import { IPulseCronAppOptions } from './interfaces.js';


export class PulseCronApp extends App {
  constructor(options?: IPulseCronAppOptions) {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      config: options,
      logs: {
        prefix: 'PulseCron'
      }
    });
  }
}