import { Service } from '@nodearch/core';
import {
  OperationObject, SchemaObject, ComponentsObject, 
  ResponsesObject, ContentObject, ReferenceObject
} from './openapi.interfaces';

@Service()
export class OpenAPIResponseParser {

  public parse(operation: OperationObject, components: ComponentsObject, httpResponses?: ResponsesObject) {
    if (!operation.responses || Object.keys(operation.responses).length) return;

    operation.responses = {};

    if (httpResponses?.length) {
      for (const status in httpResponses) {
        operation.responses[status] = httpResponses[status];
        const responseContentTypes: ContentObject | undefined = operation.responses[status].content;

        if (responseContentTypes) {

          for (const responseType in responseContentTypes) {
            const schema = <ReferenceObject|undefined> responseContentTypes[responseType].schema

            if (!schema?.$ref) {
              const definitionKey = `${operation.operationId}-response`;
              components.schemas[definitionKey] = <SchemaObject | ReferenceObject> schema;
              (<ReferenceObject> schema).$ref = `#/components/schemas/${definitionKey}`;
            }
          }
        }
      }
    }
    else {
      operation.responses[200] = { description: '' };
    }
  }
}