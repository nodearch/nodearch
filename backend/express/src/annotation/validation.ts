import { IValidationSchema } from '../interfaces';
import { ControllerMetadata } from '../metadata';


export function Validation(validationSchema: IValidationSchema): MethodDecorator {
  return function (target: Object, propKey: string | symbol) {
    ControllerMetadata.setValidation(target.constructor, {
      validation: validationSchema,
      method: <string>propKey
    });
  };
}