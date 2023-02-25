import { App, LogLevel } from '@nodearch/core';
import { CommandApp } from '@nodearch/command';


export class Cli extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      logs: { logLevel: LogLevel.Info },
      extensions: [
        new CommandApp({
          enable: true,
          name: 'nodearch',
          usage: 'Usage: nodearch <command> [options]'
        })
      ]
    });
  }
}
