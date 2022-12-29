import { App } from '@nodearch/core';
import { CommandApp } from '@nodearch/command';
import path from 'path';


export default class CliTemplate extends App {
  constructor(enable?: boolean) {
    super({
      components: {
        path: path.join(__dirname, 'components')
      },
      extensions: [
        new CommandApp({
          enable,
          name: 'cli-template',
          usage: 'Usage: cli-template <command> [options]'
        })
      ]
    });
  }
} 