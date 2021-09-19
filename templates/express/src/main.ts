import { App, LogLevel } from '@nodearch/core';
import { ExpressServer, ExpressHook, OpenAPICli } from '@nodearch/express';
import path from 'path';
import express from 'express';
import http from 'http';



export default class MyApp extends App {
  constructor() {

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    const server = http.createServer(app);

    super({
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      logging: {
        logLevel: LogLevel.Debug
      },
      extensions: [
        { 
          app: new ExpressServer({ 
            expressApp: app,
            server
          }), 
          include: [ExpressHook, OpenAPICli] 
        }
      ]
    });
  }
}