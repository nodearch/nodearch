import { Logger, Service } from '@nodearch/core';
import { SocketConfig } from './socket.config.js';
import * as IO from 'socket.io';
import http from 'http';
import https from 'https';
import { ParserService } from './parser.service.js';


@Service()
export class SocketService {
  
  private logger: Logger;
  private socketConfig: SocketConfig;
  private io: IO.Server;
  private server: http.Server | https.Server;
  private parser: ParserService; 

  constructor(logger: Logger, socketConfig: SocketConfig, parser: ParserService) {
    this.logger = logger;
    this.socketConfig = socketConfig;
    this.parser = parser;
    this.server = http.createServer();
    this.io = new IO.Server(this.server, socketConfig.ioOptions);
  } 


  async start() {
    await new Promise((resolve, reject) => {
      const { port, hostname } = this.socketConfig.server;

      this.registerNamespaces();

      this.io.on('connection', (socket) => {
        this.logger.info(`Socket ${socket.id} connected`);
      });

      this.server.on('error', err => {
        err.message = 'Error starting HTTP server for socket.io - ' + err.message;
        reject(err);
      });

      this.server.on('listening', () => {
        this.logger.info(`HTTP Server running at: ${hostname}:${port}`);
        resolve(0);
      });

      try {
        this.server.listen(port, hostname);
      }
      catch(err: any) {
        err.message = 'Error starting HTTP server for socket.io - ' + err.message;
        reject(err);
      }
    });
  }

  private registerNamespaces() {
    const namespacesMap = this.parser.parse();

    console.log(namespacesMap);

    namespacesMap.forEach((subscriptions, namespace) => {

      const nsp = this.io.of(namespace);

      nsp.on('connection', (socket) => {
        subscriptions.forEach((subscription) => {
          const { eventName, eventComponent, eventMethod } = subscription;
          // const eventHandler = eventComponent.instance[eventMethod].bind(eventComponent.instance);
  
          socket.on(eventName, (...args) => {
            console.log('eventHandler', args);
          });
        });
      });

    });
  }

  getServer(): IO.Server {
    return this.io;
  }
}