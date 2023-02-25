import { App, LogLevel } from '@nodearch/core';
import { MochaApp } from '@nodearch/mocha';

export default class Standalone extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      logs: {
        logLevel: LogLevel.Debug
      },
      extensions: [
        new MochaApp()
      ]
    });
  }
}