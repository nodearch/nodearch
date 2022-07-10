import { App, LogLevel } from '@nodearch/core';
import { ExpressServer, ExpressHook, OpenAPICli } from '@nodearch/express';
import path from 'path';
import express from 'express';
import http from 'http';
const pkg = require('../package.json');


export default class MyApp extends App {
  constructor() {

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    const server = http.createServer(app);

    super({
      appInfo: {
        name: pkg.name,
        version: pkg.version
      },
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      log: {
        logLevel: LogLevel.Debug
      },
      extensions: [
        new ExpressServer({ 
          expressApp: app,
          server
        })
      ]
    });
  }
}