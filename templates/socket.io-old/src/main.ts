import { App, LogLevel } from '@nodearch/core';
import { SocketIOHook, IO, SocketIO } from '@nodearch/socket.io';
import path from 'path';
import http from 'http';
import io from 'socket.io';
const pkg = require('../package.json');


export default class MyApp extends App {
  constructor() {
    
    const server = http.createServer();
    const ioServer = new io.Server(server, {
      cors: {
        // origin: '*',
        // methods: ["GET", "POST"],
        // allowedHeaders: ["my-custom-header"],
        credentials: true
      }
    });

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
        new SocketIO({
          ioServer: ioServer,
          sharedServer: false
        })
      ]
    });
  }
}