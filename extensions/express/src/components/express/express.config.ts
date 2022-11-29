import { Config, ConfigManager } from '@nodearch/core';
import { IHttpErrorsOptions } from '../errors/interfaces';
import { OpenAPIOptions } from '../openapi/interfaces';
import Joi from 'joi';
import multer from 'multer';
import express from 'express';
import http from 'http';
import https from 'https';


@Config()
export class ExpressConfig {
  hostname: string;
  port: number;
  http?: http.ServerOptions;
  https?: https.ServerOptions;
  httpErrors?: IHttpErrorsOptions;
  validation: Joi.ValidationOptions;
  openAPI: OpenAPIOptions;
  fileUpload?: multer.Options;

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

    this.validation = config.env({
      external: 'validation',
      defaults: {
        all: { abortEarly: false, allowUnknown: true, presence: 'optional' }
      }
    });

    this.openAPI = config.env({
      external: 'openAPI',
      defaults: {
        all: {
          info: {
            title: 'NodeArch APP',
            version: '0.1.0'
          },
          servers: [{
            url: this.hostname
          }]
        }
      }
    });

    this.fileUpload = config.env({
      external: 'fileUpload'
    });

  }
}