import { Service } from '@nodearch/core';
import j2s from 'joi-to-swagger';
import { OperationObject, ComponentsObject } from './openapi.interfaces';
import { IValidationSchema, IFileUploadInfo } from '../../interfaces';
import { ServerConfig } from '../server.config';

@Service()
export class OpenAPIRequestBodyParser {
  constructor(private readonly serverConfig: ServerConfig) {}

  public parse(
    operation: OperationObject,
    components: ComponentsObject,
    schema?: IValidationSchema, 
    fileUploadInfo?: IFileUploadInfo[]
  ) {
    if (operation.requestBody) return;
    
    if (fileUploadInfo?.length) {
      const bodySchema = schema && schema.body? j2s(schema.body).swagger : { type: 'object', properties: {} };
      bodySchema.properties = bodySchema.properties || {};

      for (const fileInfo of fileUploadInfo) {
        bodySchema.properties[fileInfo.name] = Object.assign(
          bodySchema[fileInfo.name] || {},
          fileInfo.maxCount && fileInfo.maxCount > 1 ?
          { type: 'array', items: { type: 'string', format: 'binary' }, maxItems: fileInfo.maxCount} : { type: 'string', format: 'binary' }
        );
      }

      operation.requestBody = { required: true, content: { 'multipart/form-data': { schema: bodySchema } } };
    }
    else if (schema?.body) {
      const definitionKey = `${operation.operationId}-body`;
      const bodySchema = j2s(schema.body).swagger;
      components.schemas[definitionKey] = bodySchema;
      const contentType = bodySchema.type && !['array', 'object'].includes(bodySchema.type) ? 'text/plain' : 'application/json';

      operation.requestBody = {
        required: this.isRequired(schema.body.describe()),
        content: {
          [contentType]: {
            schema: { $ref: `#/components/schemas/${definitionKey}` }
          }
        }
      };
    }
  }

  public isRequired(schemaDescription: any): boolean {
    const presence = this.serverConfig.joiValidationOptions.presence;
    return schemaDescription.flags?.presence ? schemaDescription.flags.presence === 'required' : presence === 'required';
  }
}