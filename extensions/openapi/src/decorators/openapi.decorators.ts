import { ClassMethodDecorator } from '@nodearch/core/utils';
import OAISchema from 'openapi3-ts';
import { OpenApiDecorator } from '../enums.js';
import { classDecorator, classMethodDecorator, methodDecorator } from '@nodearch/core/decorators';


export const Servers = (options: OAISchema.ServerObject[]): ClassDecorator =>
  classDecorator({ 
    id: OpenApiDecorator.SERVERS, 
    fn: () => {
      return options;
    }
  });

export const Tags = (options: string[]): ClassMethodDecorator =>
  classMethodDecorator({ 
    id: OpenApiDecorator.TAGS, 
    fn: () => {
      return options;
    }
  });

export const Responses = (options: OAISchema.ResponsesObject): MethodDecorator =>
  methodDecorator({ 
    id: OpenApiDecorator.RESPONSES, 
    fn: () => {
      return options;
    }
  });

export const RequestBody = (options: OAISchema.RequestBodyObject): MethodDecorator =>
  methodDecorator({ 
    id: OpenApiDecorator.REQUEST_BODY, 
    fn: () => {
      return options;
    }
  });

export const RouteInfo = (options: Partial<OAISchema.OperationObject>): MethodDecorator =>
  methodDecorator({ 
    id: OpenApiDecorator.ROUTE_INFO, 
    fn: () => {
      return options;
    }
  });

// export const OpenAPISchema = (options: Partial<OAISchema.OpenAPIObject>): ClassMethodDecorator =>
//   ComponentFactory.classMethodDecorator({ 
//     id: OpenApiDecorator.RouteInfo, 
//     fn: () => {
//       return options;
//     }
//   });