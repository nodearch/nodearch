import { App, LogLevel } from '@nodearch/core';
import { JsonataApp } from '@nodearch/jsonata';

export default class StandardTemplate extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      logs: {
        logLevel: LogLevel.Debug,
        prefix: 'Standard App'
      },
      extensions: [
        new JsonataApp()
      ]
    });
  }
}