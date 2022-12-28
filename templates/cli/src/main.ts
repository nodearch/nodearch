import { App } from '@nodearch/core';
import { CommandApp } from '@nodearch/command';
import path from 'path';


export default class CliTemplate extends App {
  constructor() {
    super({
      components: {
        path: path.join(__dirname, 'components')
      },
      extensions: [
        new CommandApp({
          name: 'cli-template',
          usage: 'Usage: cli-template <command> [options]'
        })
      ]
    });
  }
} 