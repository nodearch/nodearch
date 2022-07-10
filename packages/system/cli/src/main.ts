import { App, LogLevel } from '@nodearch/core';
import path from 'path';
const pkg = require('../package.json');

export class Cli extends App {
  constructor() {
    super({
      appInfo: {
        name: pkg.name,
        version: pkg.version
      },
      classLoader: { classpath: path.join(__dirname, 'components') },
      log: { logLevel: LogLevel.Info }
    });
  }
}
