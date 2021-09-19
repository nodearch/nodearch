import { App, LogLevel } from '@nodearch/core';
import { SocketIOHook, IO, SocketIO } from '@nodearch/socket.io';
import path from 'path';
import http from 'http';
import io from 'socket.io';



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
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      logging: {
        logLevel: LogLevel.Debug
      },
      extensions: [
        {
          app: new SocketIO({
            ioServer: ioServer,
            sharedServer: false
          }),
          include: [SocketIOHook, IO]
        }
      ]
    });
  }
}