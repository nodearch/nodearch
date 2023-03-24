import { ComponentFactory } from '@nodearch/core';
import { ClassMethodDecorator } from '@nodearch/core/utils';
import OAISchema from 'openapi3-ts';
import { OpenApiAnnotation } from './enums.js';


export const Servers = (options: OAISchema.ServerObject[]): ClassDecorator =>
  ComponentFactory.classDecorator({ 
    id: OpenApiAnnotation.Servers, 
    fn: () => {
      return options;
    }
  });

export const Tags = (options: string[]): ClassMethodDecorator =>
  ComponentFactory.classMethodDecorator({ 
    id: OpenApiAnnotation.Tags, 
    fn: () => {
      return options;
    }
  });

export const Responses = (options: OAISchema.ResponsesObject): MethodDecorator =>
  ComponentFactory.methodDecorator({ 
    id: OpenApiAnnotation.Responses, 
    fn: () => {
      return options;
    }
  });

export const RequestBody = (options: OAISchema.RequestBodyObject): MethodDecorator =>
  ComponentFactory.methodDecorator({ 
    id: OpenApiAnnotation.RequestBody, 
    fn: () => {
      return options;
    }
  });

export const RouteInfo = (options: Partial<OAISchema.OperationObject>): MethodDecorator =>
  ComponentFactory.methodDecorator({ 
    id: OpenApiAnnotation.RouteInfo, 
    fn: () => {
      return options;
    }
  });