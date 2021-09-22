import { ClassMethodDecorator } from '@nodearch/core';
import { IOpenAPIInfo } from '../interfaces';
import { ControllerMetadata } from '../metadata';

export function OpenAPI(openAPIInfo: IOpenAPIInfo): ClassMethodDecorator {
  return function (target: Object, propKey?: string) {
    if (propKey) {
      ControllerMetadata.setOpenApiInfo(target.constructor, { openAPIInfo, method: propKey });
    }
    else {
      ControllerMetadata.setOpenApiInfo(target, { openAPIInfo });
    }
  };
}