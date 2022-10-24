import path from 'path';
import { App, Hook, IHook, LogLevel } from '@nodearch/core';


export default class Standalone extends App {
  constructor() {
    super({
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      log: {
        logLevel: LogLevel.Debug
      },
      extensions: []
    });
  }
}

// TODO: update app options 