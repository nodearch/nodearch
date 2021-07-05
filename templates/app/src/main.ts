import { App, LogLevel } from '@nodearch/core';
import { ExpressServer } from '@nodearch/express';
import path from 'path';
import express from 'express';

/**
 * TODO: 
 * Express decorators such as Produces, Consumes, Throws, Res, etc.
 * Http Errors
 * testing app
 * Clean up App/ComponentManager interfaces
 */

export default class MyApp extends App {
  constructor() {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    super({
      appInfo: {
        name: 'Template App',
        version: '1.0.0'
      },
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      log: {
        logLevel: LogLevel.Info
      },
      extensions: [
        new ExpressServer({ 
          expressApp: app
        })
      ]
    });
  }
}