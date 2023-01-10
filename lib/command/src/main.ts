import { App } from '@nodearch/core';
// import { ClassInfo } from '@nodearch/core/components';
import path from 'path';
import { ICommandAppOptions } from './components/interfaces.js';


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