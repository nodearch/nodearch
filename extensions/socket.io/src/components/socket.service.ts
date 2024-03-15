import { Logger, Service } from '@nodearch/core';
import { SocketConfig } from './socket.config.js';
import * as IO from 'socket.io';
import http from 'http';
import https from 'https';
import { ParserService } from './parser.service.js';
import { RegistryService } from './registry.service.js';


@Service()
export class SocketService {
  
  private logger: Logger;
  private socketConfig: SocketConfig;
  private io: IO.Server;
  private server: http.Server | https.Server;
  private parser: ParserService;
  private registryService: RegistryService;

  constructor(logger: Logger, socketConfig: SocketConfig, parser: ParserService, registryService: RegistryService) {
    this.logger = logger;
    this.socketConfig = socketConfig;
    this.parser = parser;
    this.registryService = registryService;
    this.server = http.createServer();
    this.io = new IO.Server(this.server, socketConfig.ioOptions);
  } 


  async start() {
    await new Promise((resolve, reject) => {
      const { port, hostname } = this.socketConfig.server;

      // Register namespaces, events, middlewares, etc.
      this.registryService.register(this.io, this.parser.parse());

      this.server.on('error', err => {
        err.message = 'Error starting socket.io server - ' + err.message;
        reject(err);
      });

      this.server.on('listening', () => {
        this.logger.info(`Socket.io Server running at: ${hostname}:${port}`);
        resolve(0);
      });

      try {
        this.server.listen(port, hostname);
      }
      catch(err: any) {
        err.message = 'Error starting socket.io server - ' + err.message;
        reject(err);
      }
    });
  }

  getServer(): IO.Server {
    return this.io;
  }
}