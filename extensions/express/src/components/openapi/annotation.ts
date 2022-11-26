import { ClassMethodDecorator, ComponentFactory } from '@nodearch/core';
import { IOpenAPIInfo } from './interfaces';
import { ExpressAnnotationId } from '../express/enums';


export function OpenAPI(openAPIInfo: IOpenAPIInfo): ClassMethodDecorator {
  return ComponentFactory.classMethodDecorator({
    id: ExpressAnnotationId.OpenAPI,
    fn() {
      return openAPIInfo;
    }
  });
}