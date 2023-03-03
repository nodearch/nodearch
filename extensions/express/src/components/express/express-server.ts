import { Logger, Service } from '@nodearch/core';
import { ExpressConfig } from './express.config.js';
import http from 'node:http';
import https from 'node:https';
import { ExpressApp } from './express-app.js';


@Service()
export class ExpressServer {
  private expressConfig: ExpressConfig;
  private logger: Logger;
  private expressApp: ExpressApp;

  constructor(expressConfig: ExpressConfig, expressApp: ExpressApp, logger: Logger) {
    this.expressConfig = expressConfig;
    this.expressApp = expressApp;
    this.logger  = logger;
  }

  async start() {
    const httpServer = this.createServer();

    await new Promise((resolve, reject) => {
      httpServer.listen(this.expressConfig.port, this.expressConfig.hostname);

      httpServer.on('error', err => {
        reject(err);
      });

      httpServer.on('listening', () => {
        this.logger.info(`Express: Server running at: ${this.expressConfig.hostname}:${this.expressConfig.port}`);
        resolve(0);
      });
    });
  }

  private createServer() {
    let httpServer: http.Server | https.Server;
    
    const expressApp = this.expressApp.create();

    if (this.expressConfig.https) {
      httpServer = https.createServer(this.expressConfig.https, expressApp);
    }
    else if (this.expressConfig.http) {
      httpServer = http.createServer(this.expressConfig.http, expressApp);
    }
    else {
      httpServer = http.createServer(expressApp);
    }

    return httpServer;
  }
}