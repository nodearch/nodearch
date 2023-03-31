import { ComponentFactory } from '@nodearch/core';
import { Use } from '@nodearch/express';
import { JoiAnnotation } from '../enums.js';
import Joi from 'joi';
import { ValidationMiddleware } from '../components/validation.middleware.js';


export const Validate = (schema: Joi.Schema): MethodDecorator => {
  return ComponentFactory.methodDecorator({
    id: JoiAnnotation.Validate,
    fn(target, propKey, descriptor) {

      Use(ValidationMiddleware, schema)(target, propKey as string);

      return schema;
    }
  });
}