import { App } from '@nodearch/core';
import path from 'path';
import { IExpressAppOptions } from './components/express/interfaces';


export class ExpressApp extends App {
  constructor(options: IExpressAppOptions) {
    super({
      components: {
        path: path.join(__dirname, 'components')
      },
      config: options
    });
  }
}
