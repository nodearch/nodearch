import { App, Hook, IHook, LogLevel } from '@nodearch/core';
import path from 'path';

@Hook()
class One implements IHook {
  async onInit() {
    console.log('on init');
  }
}


export default class Standalone extends App {
  constructor() {
    super({
      classLoader: {
        // classpath: path.join(__dirname, 'components'),
        classes: [One]
      },
      log: {
        logLevel: LogLevel.Debug
      },
      extensions: []
    });
  }
}