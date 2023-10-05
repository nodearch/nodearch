import { Use } from '@nodearch/core';
import { JoiDecorator } from '../enums.js';
import Joi from 'joi';
import { ValidationMiddleware } from '../components/validation.middleware.js';
import { ComponentFactory } from '@nodearch/core/components';
import { IJoiSchemaKeys } from '../interfaces.js';


export const Validate = (schema: Joi.Schema<IJoiSchemaKeys>): MethodDecorator => {
  return ComponentFactory.methodDecorator({
    id: JoiDecorator.VALIDATE,
    fn(target, propKey, descriptor) {

      const description = schema.describe();

      if (description.type !== 'object') {
        const locationMsg = `@Validate(X) ${target.constructor.name}.${propKey as string}`;
        throw new Error(`Joi validation middleware only supports object schemas, ${description.type} given - ${locationMsg}`);
      }

      Use(ValidationMiddleware, schema)(target, propKey as string);

      return schema;
    }
  });
}