import { ComponentFactory } from '@nodearch/core';
import { ExpressAnnotationId } from '../express/enums';
import { IValidationSchema } from './interfaces';


export function Validation(validationSchema: IValidationSchema): MethodDecorator {
  return ComponentFactory.methodDecorator({ 
    id: ExpressAnnotationId.Validation,
    fn() {
      return validationSchema;
    }
  });
}