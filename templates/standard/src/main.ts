import { App, LogLevel } from '@nodearch/core';

export default class StandardTemplate extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      logs: {
        logLevel: LogLevel.Debug,
        prefix: 'Standard App'
      }
    });
  }
}