import { Use } from '@nodearch/core';
import { JoiDecorator } from '../enums.js';
import Joi from 'joi';
import { ValidationMiddleware } from '../components/validation.middleware.js';
import { methodDecorator } from '@nodearch/core/decorators';


export const Validate = (schema: Joi.Schema): MethodDecorator => {
  return methodDecorator({
    id: JoiDecorator.VALIDATE,
    fn(target, propKey, descriptor) {

      Use(ValidationMiddleware, schema)(target, propKey as string);

      return schema;
    }
  });
}