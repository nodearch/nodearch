import Joi from 'joi';


export interface IValidationSchema {
  headers?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  body?: Joi.Schema;
}