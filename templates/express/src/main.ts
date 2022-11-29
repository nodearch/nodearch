import { App } from '@nodearch/core';
import { ExpressApp } from '@nodearch/express';
import path from 'path';


export default class MyApp extends App {
  constructor() {
    super({
      components: {
        path: path.join(__dirname, 'components')
      },
      extensions: [
        new ExpressApp()
      ]
    });
  }
}