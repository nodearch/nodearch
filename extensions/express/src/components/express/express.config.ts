import { Config, ConfigManager } from '@nodearch/core';
import { IHttpErrorsOptions } from '../errors/interfaces.js';
import http from 'node:http';
import https from 'node:https';
import { IExpressStatic, IHttpLogger, IJsonParserOptions, ITextParserOptions, IUrlencodedParserOptions } from './interfaces.js';
import { IExpressMiddlewareHandler } from '../middleware/interfaces.js';


@Config()
export class ExpressConfig {
  hostname: string;
  port: number;
  httpPath?: string;
  http?: http.ServerOptions;
  https?: https.ServerOptions;
  httpErrors?: IHttpErrorsOptions;
  static?: IExpressStatic[];
  use?: IExpressMiddlewareHandler[];
  jsonParser: IJsonParserOptions;
  textParser: ITextParserOptions;
  urlencodedParser: IUrlencodedParserOptions;
  httpLogger: IHttpLogger;

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

    this.httpPath = config.env({
      external: 'httpPath',
      required: false
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

    this.use = config.env({
      external: 'use',
      required: false
    });

    this.jsonParser = config.env({
      external: 'parsers.json',
      defaults: {
        all: {
          enable: true
        }
      }
    });

    this.textParser = config.env({
      external: 'parsers.text',
      defaults: {
        all: {
          enable: false
        }
      }
    });

    this.urlencodedParser = config.env({
      external: 'parsers.urlencoded',
      defaults: {
        all: {
          enable: true,
          options: {
            extended: true
          }
        }
      }
    });

    this.httpLogger = config.env({
      external: 'httpLogger',
      defaults: {
        all: {
          enable: true,
          showStatus: true,
          showDuration: true
        }
      }
    });
  }
}