import { App } from '@nodearch/core';
import { ExpressServer, ExpressHook, OpenAPICli } from '@nodearch/express';
import path from 'path';
import express from 'express';



export default class MyApp extends App {
  constructor() {

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    super({
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      extensions: [
        { 
          app: new ExpressServer({ 
            expressApp: app
          }
        ), include: [ExpressHook, OpenAPICli] },
      ]
    });
  }
}