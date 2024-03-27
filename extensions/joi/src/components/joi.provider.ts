import { IExtensionProvider, Service } from '@nodearch/core';
import Joi from 'joi';


@Service({ export: true })
export class JoiProvider implements IExtensionProvider {
  
  private joi: Joi.Schema;

  constructor() {
    this.joi = Joi.preferences({});
  }  

  get() {
    return this.joi;
  }
}