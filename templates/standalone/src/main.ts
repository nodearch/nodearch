import path from 'path';
import { App, LogLevel } from '@nodearch/core';

export default class Standalone extends App {
  constructor() {
    super({
      path: path.join(__dirname, 'components'),
      log: {
        logLevel: LogLevel.Debug
      }
    });
  }
}

// TODO: log or logging? I guess log