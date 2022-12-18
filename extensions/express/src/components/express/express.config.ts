import { Config, ConfigManager } from '@nodearch/core';
import { IHttpErrorsOptions } from '../errors/interfaces';
import http from 'http';
import https from 'https';
import { IExpressStatic } from './interfaces';


@Config()
export class ExpressConfig {
  hostname: string;
  port: number;
  http?: http.ServerOptions;
  https?: https.ServerOptions;
  httpErrors?: IHttpErrorsOptions;
  static?: IExpressStatic[];

  constructor(config: ConfigManager) {
    this.hostname = config.env({
      external: 'hostname',
      defaults: {
        all: 'localhost'
      }
    });

    this.port = config.env({
      external: 'port',
      defaults: {
        all: 3000
      }
    });

    this.http = config.env({
      external: 'http'
    });

    this.https = config.env({
      external: 'https'
    });

    this.httpErrors = config.env({
      external: 'httpErrors'
    });

    this.static = config.env({
      external: 'static'
    });

  }
}