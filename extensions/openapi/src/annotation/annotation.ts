import { ComponentFactory } from '@nodearch/core';
import OAISchema from 'openapi3-ts';
import { OpenApiAnnotation } from './enums.js';


export const ResponseObject = (options?: OAISchema.ResponseObject): MethodDecorator =>
  ComponentFactory.methodDecorator({ 
    id: OpenApiAnnotation.ResponseObject, 
    fn: () => {
      return options;
    }
  });