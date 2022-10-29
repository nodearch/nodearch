import path from 'path';
import { App, LogLevel } from '@nodearch/core';
import { Mocha } from '@nodearch/mocha';

export default class Standalone extends App {
  constructor() {
    super({
      components: {
        path: path.join(__dirname, 'components')
      },
      logs: {
        logLevel: LogLevel.Debug
      },
      extensions: [
        new Mocha()
      ]
    });
  }
}