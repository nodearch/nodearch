import { ComponentFactory } from '@nodearch/core';
import OAISchema from 'openapi3-ts';
import { OpenApiAnnotation } from './enums.js';


export const Responses = (options: OAISchema.ResponsesObject): MethodDecorator =>
  ComponentFactory.methodDecorator({ 
    id: OpenApiAnnotation.Responses, 
    fn: () => {
      return options;
    }
  });


export const Servers = (options: OAISchema.ServerObject[]): ClassDecorator =>
  ComponentFactory.classDecorator({ 
    id: OpenApiAnnotation.Servers, 
    fn: () => {
      return options;
    }
  });

export const Tags = (options: string[]): MethodDecorator =>
  ComponentFactory.methodDecorator({ 
    id: OpenApiAnnotation.Tags, 
    fn: () => {
      return options;
    }
  });