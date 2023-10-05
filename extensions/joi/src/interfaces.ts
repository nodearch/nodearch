import Joi from 'joi';
import { JoiProvider } from './index.js';
import { ClassConstructor } from '@nodearch/core/utils';


export interface IJoiAppOptions {}

export interface IValidateOptions {
  input?: {
    [key: string]: Joi.Schema;
  };
  output?: Joi.Schema;
}

export type IJoiProvider = ClassConstructor<JoiProvider>;