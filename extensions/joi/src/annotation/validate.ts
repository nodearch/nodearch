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
        console.log('Validate called in Value', args);

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

        return method.apply(this, arguments);
      }
    }
  });
}

export const JoiSchema = (schema: Joi.Schema): ParameterDecorator => {
  return ComponentFactory.parameterDecorator({
    id: JoiAnnotation.Schema,
    fn(target, propKey, paramIndex) {
      return schema;
    }
  });
}