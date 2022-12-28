import { App } from '@nodearch/core';
import path from 'path';
import { ICommandAppOptions } from './components/interfaces';


export class CommandApp extends App {
  constructor(config: ICommandAppOptions) {
    super({
      components: {
        path: path.join(__dirname, 'components')
      },
      config
    });
  }
}