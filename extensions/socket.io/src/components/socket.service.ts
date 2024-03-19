import { Logger, Service } from '@nodearch/core';
import { SocketConfig } from './socket.config.js';
import * as IO from 'socket.io';
import http from 'http';
import https from 'https';
import { ParserService } from './parser.service.js';
import { RegistryService } from './registry.service.js';
import { ServerPatch } from './server-patches.js';
import { INamespaceMap } from '../interfaces.js';


@Service()
export class SocketService {
  
  private logger: Logger;
  private socketConfig: SocketConfig;
  private io: IO.Server;
  private server: http.Server | https.Server;
  private parser: ParserService;
  private registryService: RegistryService;
  private serverPatch: ServerPatch;

  constructor(
    logger: Logger, socketConfig: SocketConfig,
    parser: ParserService, registryService: RegistryService, 
    serverPatch: ServerPatch
  ) {
    this.logger = logger;
    this.socketConfig = socketConfig;
    this.parser = parser;
    this.registryService = registryService;
    this.serverPatch = serverPatch;
    this.server = http.createServer();
    this.io = new IO.Server(this.server, socketConfig.ioOptions);
  } 


  async start() {
    await new Promise((resolve, reject) => {
      const { port, hostname } = this.socketConfig.server;

      const namespacesData = this.parser.parse();

      this.protectDefaultNamespace(namespacesData);

      // Register namespaces, events, middlewares, etc.
      this.register(this.io, namespacesData);

      // this.serverPatch.patch(this.io, namespacesData);

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

  private protectDefaultNamespace(namespacesData: INamespaceMap) {
    let hasDefaultNamespace = false;

    namespacesData.forEach((namespaceInfo) => {
      if (namespaceInfo.name === '/') {
        hasDefaultNamespace = true;
      }
    });

    if (!hasDefaultNamespace) {
      this.io
        .of('/')
        .use((socket, next) => {
          this.logger.warn(`Default namespace not allowed - Socket ID: ${socket.id}`);
          next(new Error('Default namespace not allowed'));
        });
    }
  }

  private register(io: IO.Server, namespaceMap: INamespaceMap) {
    namespaceMap.forEach((namespaceInfo, namespace) => {
      this.registryService.register(io, namespaceInfo, namespace);
    });
  }

  getServer(): IO.Server {
    return this.io;
  }
}