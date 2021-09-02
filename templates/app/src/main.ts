import { App } from '@nodearch/core';
import { ExpressServer, ExpressHook, OpenAPICli } from '@nodearch/express';
import { SocketIO, SocketIOHook } from '@nodearch/socket.io';
import path from 'path';
import express from 'express';
import http from 'http';
import io from 'socket.io';



export default class MyApp extends App {
  constructor() {

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    const server = http.createServer(app);
    const ioServer = new io.Server(server, {
      cors: {
        // origin: '*',
        // methods: ["GET", "POST"],
        // allowedHeaders: ["my-custom-header"],
        credentials: true
      }
    });

    super({
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      extensions: [
        { 
          app: new ExpressServer({ 
            expressApp: app,
            server
          }), 
          include: [ExpressHook, OpenAPICli] 
        },
        {
          app: new SocketIO({
            ioServer: ioServer
          }),
          include: [SocketIOHook]
        }
      ]
    });
  }
}