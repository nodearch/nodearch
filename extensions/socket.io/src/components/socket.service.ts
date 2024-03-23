import { AppContext, Logger, Service } from '@nodearch/core';
import { SocketConfig } from './socket.config.js';
import * as IO from 'socket.io';
import http from 'http';
import https from 'https';
import { ParserService } from './parser.service.js';
import { RegistryService } from './registry.service.js';
import { ServerPatch } from './server-patches.js';
import { IAdapter, INamespaceMap, INativeAdapter } from '../interfaces.js';
import { ComponentFactory } from '@nodearch/core/components';


@Service()
export class SocketService {

  private logger: Logger;
  private socketConfig: SocketConfig;
  private io: IO.Server;
  private server: http.Server | https.Server;
  private parser: ParserService;
  private registryService: RegistryService;
  // private serverPatch: ServerPatch;
  private appContext: AppContext;

  constructor(
    logger: Logger, socketConfig: SocketConfig,
    parser: ParserService, registryService: RegistryService,
    serverPatch: ServerPatch, appContext: AppContext
  ) {
    this.logger = logger;
    this.socketConfig = socketConfig;
    this.parser = parser;
    this.registryService = registryService;
    // this.serverPatch = serverPatch;
    this.appContext = appContext;
    this.server = http.createServer();
    this.io = new IO.Server(this.server, socketConfig.ioOptions);
  }


  async start() {
    await new Promise((resolve, reject) => {
      const { port, hostname } = this.socketConfig.server;

      this.registerAdapters();

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
      catch (err: any) {
        err.message = 'Error starting socket.io server - ' + err.message;
        reject(err);
      }
    });
  }

  private registerAdapters() {
    const adapter = this.socketConfig.adapter;

    if (!adapter) return;

    const isComponent = ComponentFactory.isComponent(adapter);

    if (isComponent) {
      const adapterInstance = this.appContext.getContainer().get<IAdapter>(adapter);
      
      if (adapterInstance) {
        this.io.adapter(adapterInstance.get());
      }
      else {
        throw new Error(`Adapter instance not found for: ${adapter.name}`);
      }
    }
    else {
      this.io.adapter(adapter);
    }
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