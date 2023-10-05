import { Service } from '@nodearch/core';
import { OAISchema } from '@nodearch/openapi';
import { JoiSchema } from '../interfaces.js';
import j2s from 'joi-to-swagger';


@Service()
export class JoiOpenApiService {
  getRouteInfo(schema: JoiSchema): Partial<OAISchema.OperationObject> {

    const openAPI: Partial<OAISchema.OperationObject> = {
      parameters: []
    };

    const { swagger, components } = j2s.default(schema);

    const { query, headers, params, cookies, body } = swagger.properties;

    if (query) {
      const queryParams = this.getParams('query', query);
      openAPI.parameters = openAPI.parameters!.concat(queryParams);
    }

    if (headers) {
      const headerParams = this.getParams('header', headers);
      openAPI.parameters = openAPI.parameters!.concat(headerParams);
    }

    if (params) {
      const pathParams = this.getParams('path', params);
      openAPI.parameters = openAPI.parameters!.concat(pathParams);
    }

    if (cookies) {
      const cookieParams = this.getParams('cookie', cookies);
      openAPI.parameters = openAPI.parameters!.concat(cookieParams);
    }

    if (body) {
      openAPI.requestBody = this.getBody(body);
    }

    return openAPI;
  }

  private getParams(location: string, schema: j2s.SwaggerSchema) {
    const parameters: any[] = [];

    const paramKeys = Object.keys(schema.properties);

    paramKeys.forEach(key => {
      const paramSchema = schema.properties[key];
      const parameter = {
        name: key,
        in: location,
        required: schema.required.includes(key),
        schema: paramSchema
      };

      parameters.push(parameter);
    });

    return parameters;
  }

  private getBody(schema: j2s.SwaggerSchema) {
    return {
      content: {
        'application/json': {
          schema: schema
        }
      }
    };
  }
}