import Joi from 'joi';

export interface IJoiExpressAppOptions {
  joiOptions?: Joi.ValidationOptions;
}

export interface IJoiSchemaKeys {
  body?: string;
  query?: string;
  params?: string;
  headers?: string;
  cookies?: string;
}

export type JoiSchema = Joi.Schema<IJoiSchemaKeys>;