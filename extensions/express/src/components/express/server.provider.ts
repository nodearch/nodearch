import { Service } from '@nodearch/core';
import { ExpressServer } from './express-server.js';


@Service({ export: true })
export class HttpServerProvider {
  constructor(
    private readonly expressServer: ExpressServer
  ) {}

  getServer() {
    this.expressServer.getServer();
  }
}