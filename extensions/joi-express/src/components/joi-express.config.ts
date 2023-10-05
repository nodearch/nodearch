import { Config, ConfigManager } from '@nodearch/core';
import { IJoiExpressAppOptions } from '../interfaces.js';
import Joi from 'joi';


@Config()
export class JoiExpressConfig implements IJoiExpressAppOptions {
  
  joiOptions?: Joi.ValidationOptions;

  constructor(config: ConfigManager) {
    this.joiOptions = config.env({
      external: 'joiOptions',
      required: false,
      defaults: {
        all: {
          allowUnknown: true,
          abortEarly: false,
          stripUnknown: false
        }
      }
    });    
  }
}