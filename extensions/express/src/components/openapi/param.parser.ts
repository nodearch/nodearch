import { Service } from '@nodearch/core';
import j2s from 'joi-to-swagger';
import {
   OperationObject, ParameterObject,
  ParametersList, SchemaObject
} from './openapi.interfaces';
import { IValidationSchema } from '../../interfaces';

@Service()
export class OpenAPIParamsParser {

  public parse(operation: OperationObject, pathParams: string[], schema?: IValidationSchema) {
    if (operation.parameters) return;
    
    operation.parameters = this.parsePathParams(pathParams, schema);

    if (schema) {
      const headerParams = this.parseHeaders(schema);
      const queryParams = this.parseQueryParams(schema);
      operation.parameters.push(...headerParams, ...queryParams);
    }
  }

  private parseHeaders(schema: IValidationSchema): ParameterObject[] {
    const parameters: ParameterObject[] = []

    if (schema.headers) {
      const headersSchema = j2s(schema.headers).swagger;

      for (const header in headersSchema.properties) {
        parameters.push({
          name: header,
          in: 'header',
          schema: Object.assign({ type: 'string' }, headersSchema.properties[header]),
          required: headersSchema.required?.includes(header) ? true : false
        });
      }
    }

    return parameters;
  }

  private parseQueryParams(schema: IValidationSchema): ParameterObject[] {
    const parameters: ParameterObject[] = []

    if (schema.query) {
      const querySchema = j2s(schema.query).swagger;

      for(const query in querySchema.properties) {
        parameters.push({
          name: query,
          in: 'query',
          schema: Object.assign({ type: 'string' }, querySchema.properties[query]),
          required: querySchema.required?.includes(query) ? true : false
        });
      }
    }

    return parameters;
  }

  private parsePathParams(pathParams: string[], schema?: IValidationSchema): ParameterObject[] {
    const urlParamsRules: ParametersList = {};
    const parameters: ParameterObject[] = []

    if (schema?.params) {
      const paramsSchema = j2s(schema.params).swagger;

      for (const param in paramsSchema.properties) {
        urlParamsRules[param] = paramsSchema.properties[param];
      }
    }

    if (pathParams) {
      for (const param of pathParams) {
        const paramObject: ParameterObject = {
          name: param,
          in: 'path',
          schema: <SchemaObject>(urlParamsRules[param] || { type: 'string' }),
          required: true
        };

        parameters.push(paramObject);
      }
    }

    return parameters;
  }
}