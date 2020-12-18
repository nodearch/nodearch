import { App, LogLevel } from '@nodearch/core';
import path from 'path';

export class CLI extends App {
  constructor() {
    super({
      classLoader: { classpath: path.join(__dirname, 'components') },
      logging: { logLevel: LogLevel.Info }
    });
  }
}
