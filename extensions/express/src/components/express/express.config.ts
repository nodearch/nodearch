import { Config, ConfigManager } from '@nodearch/core';
import { IHttpErrorsOptions } from '../errors/interfaces.js';
import http from 'node:http';
import https from 'node:https';
import { IExpressStatic, IValidationOptions } from './interfaces.js';


@Config()
export class ExpressConfig {
  hostname: string;
  port: number;
  http?: http.ServerOptions;
  https?: https.ServerOptions;
  httpErrors?: IHttpErrorsOptions;
  static?: IExpressStatic[];
  validation?: IValidationOptions;

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

    this.validation = config.env({
      external: 'validation'
    });

  }
}