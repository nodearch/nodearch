import { App } from '@nodearch/core';
// import { Paths } from '@nodearch/core/fs';
// import { CommandApp } from '@nodearch/command';
// import path from 'node:path';

export default class CliTemplate extends App {
  constructor(enable?: boolean) {
    super({
      components: {
        path: new URL('components', import.meta.url)
      },
      // extensions: [
      //   new CommandApp({
      //     enable,
      //     name: 'cli-template',
      //     usage: 'Usage: cli-template <command> [options]'
      //   })
      // ]
    });
  }
} 