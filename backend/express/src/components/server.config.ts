import { Config, ConfigManager } from '@nodearch/core';
import { IHttpErrorsOptions } from '../interfaces';
import Joi from 'joi';
import { OpenAPIOptions } from './openapi/openapi.interfaces';
import multer from 'multer';
import express from 'express';


@Config()
export class ServerConfig {
  hostname: string;
  port: number;
  httpErrorsOptions: IHttpErrorsOptions;
  joiValidationOptions: Joi.ValidationOptions;
  openAPIOptions: OpenAPIOptions;
  fileUploadOptions?: multer.Options;
  expressApp: express.Application;

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

    this.httpErrorsOptions = config.env({
      external: 'httpErrorsOptions'
    });

    this.joiValidationOptions = config.env({
      external: 'joiValidationOptions',
      defaults: {
        all: { abortEarly: false, allowUnknown: true, presence: 'optional' }
      }
    });

    this.openAPIOptions = config.env({
      external: 'openAPIOptions',
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

    this.fileUploadOptions = config.env({
      external: 'fileUploadOptions'
    });

    this.expressApp = config.env({
      external: 'expressApp'
    });
  }
}