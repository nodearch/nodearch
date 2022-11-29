import { Logger, Service } from '@nodearch/core';
import { ExpressConfig } from './express.config';
import http from 'http';
import https from 'https';
import express from 'express';


@Service()
export class ExpressServer {
  httpServer: http.Server | https.Server;
  expressApp: express.Application;
  private expressConfig: ExpressConfig;
  private logger: Logger;

  constructor(expressConfig: ExpressConfig, logger: Logger) {
    this.expressConfig = expressConfig;
    this.logger  = logger;
    const { httpServer, expressApp } = this.createServer();
    this.httpServer = httpServer;
    this.expressApp = expressApp;    
  }

  async start() {
    await new Promise((resolve, reject) => {
      this.httpServer.listen(this.expressConfig.port, this.expressConfig.hostname);

      this.httpServer.on('error', err => {
        reject(err);
      });

      this.httpServer.on('listening', () => {
        this.logger.info(`Express: Server running at: ${this.expressConfig.hostname}:${this.expressConfig.port}`);
        resolve(0);
      });
    });
  }

  private createServer() {
    let httpServer: http.Server | https.Server;
    
    const expressApp = express();

    if (this.expressConfig.https) {
      httpServer = https.createServer(this.expressConfig.https, expressApp);
    }
    else if (this.expressConfig.http) {
      httpServer = http.createServer(this.expressConfig.http, expressApp);
    }
    else {
      httpServer = http.createServer(expressApp);
    }

    return { httpServer, expressApp };
  }
}