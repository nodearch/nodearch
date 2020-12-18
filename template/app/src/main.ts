import { App } from '@nodearch/core';
import { ExpressServer, ExpressHook, OpenAPICli } from '@nodearch/express';
import path from 'path';
import express from 'express';


export default class MyApp extends App {
  constructor() {
    super({
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      extensions: [
        { 
          app: new ExpressServer({ 
            expressApp: express()
          }
        ), include: [ExpressHook, OpenAPICli] },
      ]
    });
  }
}