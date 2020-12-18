import { ClassInfo, Service } from '@nodearch/core';
import { ControllerMetadata } from '../metadata';
import { IHttpControllerInfo } from '../interfaces';


@Service()
export class HttpControllerInfo {
  parse(controller: any): IHttpControllerInfo {
    const httpControllerInfo: IHttpControllerInfo = {
      methods: []
    };

    const httpPrefix = ControllerMetadata.getHttpPrefix(controller.constructor);

    const methods = ClassInfo.getMethods(controller.constructor);

    methods.forEach(method => {
      const methodInfo = ControllerMetadata.getHttpInfo(controller, method);

      if (methodInfo) {
        httpControllerInfo.methods.push({
          name: method,
          httpMethod: methodInfo.httpMethod,
          httpPath: httpPrefix ? httpPrefix + methodInfo.httpPath : methodInfo.httpPath,
          params: ControllerMetadata.getHttpParamsInfo(controller, method)
        });
      }

    });

    return httpControllerInfo;
  }
}