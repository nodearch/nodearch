import express from 'express';
import http from 'http';
import https from 'https';
import { Service, Logger, IComponentRegistryInfo } from '@nodearch/core';
import { ServerConfig } from './server.config';
import { RoutesService } from './routes.service';


@Service()
export class ExpressService {

  private server: http.Server | https.Server;
  private expressApp: express.Application;
  private serverConfig: ServerConfig;
  private logger: Logger;
  private routesService: RoutesService;

  constructor(
    serverConfig: ServerConfig,
    logger: Logger,
    routesService: RoutesService
  ) {
    this.serverConfig = serverConfig;
    this.logger = logger;
    this.routesService = routesService;
    this.expressApp = this.serverConfig.expressApp;
    this.server = this.serverConfig.server || http.createServer(this.expressApp);
  }

  /**
   * Register all routes from the given controllers list into Express instance
   * @param controllers list of controllers to register
   * @param dependencyFactory factory function to resolve controller instances from the DI Container
   */
  async init(controllers: IComponentRegistryInfo[], dependencyFactory: (x: any) => any) {
    controllers.forEach(controller =>
      this.routesService.registerController(controller, this.expressApp, dependencyFactory)
    );
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.listen(this.serverConfig.port, this.serverConfig.hostname);

      this.server.on('error', err => {
        reject(err);
      });

      this.server.on('listening', () => {
        this.logger.info(`Express: Server running at: ${this.serverConfig.hostname}:${this.serverConfig.port}`);
        resolve();
      });
    });
  }

  stop() {
    this.server.close();
  }

  /**
   * get the initialized express instance
   */
  get express() {
    return this.expressApp;
  }
}