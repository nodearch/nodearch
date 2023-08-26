import { App } from '@nodearch/core';
import { CommandApp } from '@nodearch/command';


export default class CliTemplate extends App {
  constructor(enable?: boolean) {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      extensions: [
        new CommandApp({
          autoStart: enable,
          name: 'cli-template',
          usage: 'Usage: cli-template <command> [options]'
        })
      ]
    });
  }
}