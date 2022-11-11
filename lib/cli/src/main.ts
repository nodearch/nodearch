import { App, LogLevel } from '@nodearch/core';
import path from 'path';


export class Cli extends App {
  constructor() {
    super({
      components: {
        path: path.join(__dirname, 'components')
      },
      logs: { logLevel: LogLevel.Info }
    });
  }
}
