import Joi from 'joi';

export interface IJoiAppOptions {}

export interface IValidateOptions {
  input?: {
    [key: string]: Joi.Schema;
  };
  output?: Joi.Schema;
}