import { ComponentFactory } from '@nodearch/core';
import { JoiAnnotation } from '../enums.js';
import Joi from 'joi';
import { IValidateOptions } from '../interfaces.js';


export const Validate = (schema: IValidateOptions): MethodDecorator => {
  return ComponentFactory.methodDecorator({
    id: JoiAnnotation.Validate,
    fn(target, propKey, descriptor) {
      const method = descriptor.value;

      descriptor.value = async function (...args: any) {
        if (schema.input) {

          const inputData: any = {};

          Object.keys(schema.input).forEach((key, index) => {
            inputData[key] = args[index];
          });

          const result = Joi.object({
            ...schema.input
          })
            .validate(inputData);

          if (result.error) {
            throw result.error;
          }
        }

        // TODO: Add output validation

        return method.apply(this, arguments);

      }
    }
  });
}