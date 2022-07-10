import { ClassInfo, Service } from '@nodearch/core';
import { ControllerMetadata } from '../metadata';
import { IHttpControllerInfo, IHTTPInfo } from '../interfaces';


@Service()
export class HttpControllerInfo {
  parse(controller: any): IHttpControllerInfo {
    const httpControllerInfo: IHttpControllerInfo = {
      methods: []
    };

    const httpPrefix = ControllerMetadata.getHttpPrefix(controller);
    const httpInfo: IHTTPInfo[] = ControllerMetadata.getHttpInfo(controller);
    const httpParamsInfo = ControllerMetadata.getHttpParamsInfo(controller);

    httpInfo.forEach(hInfo => {
      httpControllerInfo.methods.push({
        ...hInfo,
        httpPath: httpPrefix ? httpPrefix + hInfo.httpPath : hInfo.httpPath,
        params: httpParamsInfo[hInfo.name] || []
      })
    });

    return httpControllerInfo;
  }
}