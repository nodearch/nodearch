import { MetadataInfo } from '@nodearch/core';
import { 
  IHTTPInfo, IHTTPMethodParamInfo, IMiddlewareMetadataInfo, IValidationMetadataInfo,
  IFileUploadMetadataInfo, IOpenAPIMetadataInfo 
} from './interfaces';


export abstract class ControllerMetadata {
  static readonly PREFIX = 'express/controller';
  static readonly CONTROLLER_HTTP_PREFIX = ControllerMetadata.PREFIX + '-http-prefix';
  static readonly CONTROLLER_HTTP_INFO = ControllerMetadata.PREFIX + '-http-info';
  static readonly CONTROLLER_PARAMS_INFO = ControllerMetadata.PREFIX + '-params-info';
  static readonly CONTROLLER_MIDDLEWARES = ControllerMetadata.PREFIX + '-middlewares';
  static readonly CONTROLLER_MIDDLEWARE_PROVIDER = ControllerMetadata.PREFIX + '-middleware-provider';
  static readonly CONTROLLER_VALIDATION = ControllerMetadata.PREFIX + '-validation';
  static readonly CONTROLLER_UPLOAD_INFO = ControllerMetadata.PREFIX + '-upload-info';
  static readonly CONTROLLER_OPEN_API = ControllerMetadata.PREFIX + '-openapi-info';

  static getHttpPrefix(controller: any): string {
    return MetadataInfo.getClassMetadata(ControllerMetadata.CONTROLLER_HTTP_PREFIX, controller);
  }

  static setHttpPrefix(controller: any, prefix: string) {
    MetadataInfo.setClassMetadata(ControllerMetadata.CONTROLLER_HTTP_PREFIX, controller, prefix);
  }

  static getHttpInfo(controller: any, methodName: string | symbol): IHTTPInfo {
    return MetadataInfo.getMethodMetadata(ControllerMetadata.CONTROLLER_HTTP_INFO, controller, methodName);
  }

  static setHttpInfo(controller: any, methodName: string | symbol, httpInfo: IHTTPInfo): void {
    MetadataInfo.setMethodMetadata(ControllerMetadata.CONTROLLER_HTTP_INFO, controller, methodName, httpInfo);
  }

  static setHttpParamsInfo(controller: any, propKey: string | symbol, pInfo: IHTTPMethodParamInfo) {
    const paramsInfo = ControllerMetadata.getHttpParamsInfo(controller, propKey);
    paramsInfo.push(pInfo);

    MetadataInfo.setMethodMetadata(ControllerMetadata.CONTROLLER_PARAMS_INFO, controller, propKey, paramsInfo);
  }

  static getHttpParamsInfo(controller: any, propKey: string | symbol): IHTTPMethodParamInfo[] {
    return MetadataInfo.getMethodMetadata(ControllerMetadata.CONTROLLER_PARAMS_INFO, controller, propKey) || [];
  }

  static setMiddleware(controller: any, middleware: IMiddlewareMetadataInfo) {
    const middlewares = ControllerMetadata.getMiddlewares(controller);
    middlewares.push(middleware);

    MetadataInfo.setClassMetadata(ControllerMetadata.CONTROLLER_MIDDLEWARES, controller, middlewares);
  }

  static getMiddlewares(controller: any): IMiddlewareMetadataInfo[] {
    return MetadataInfo.getClassMetadata(ControllerMetadata.CONTROLLER_MIDDLEWARES, controller) || [];
  }

  static setMiddlewareProvider(component: any) {
    MetadataInfo.setClassMetadata(ControllerMetadata.CONTROLLER_MIDDLEWARE_PROVIDER, component, 'middleware-provider');
  }

  static isMiddlewareProvider(component: any): boolean {
    return MetadataInfo.getClassMetadata(ControllerMetadata.CONTROLLER_MIDDLEWARE_PROVIDER, component) === 'middleware-provider';
  }

  static setValidation(controller: any, validation: IValidationMetadataInfo) {
    const existingValidation = ControllerMetadata.getValidation(controller);
    existingValidation.push(validation);

    MetadataInfo.setClassMetadata(ControllerMetadata.CONTROLLER_VALIDATION, controller, existingValidation);
  }

  static getValidation(controller: any): IValidationMetadataInfo[] {
    return MetadataInfo.getClassMetadata(ControllerMetadata.CONTROLLER_VALIDATION, controller) || [];
  }

  static setUploadInfo(controller: any, fileUploadInfo: IFileUploadMetadataInfo) {
    const existingUploadInfo = ControllerMetadata.getUploadInfo(controller);
    existingUploadInfo.push(fileUploadInfo);

    MetadataInfo.setClassMetadata(ControllerMetadata.CONTROLLER_UPLOAD_INFO, controller, existingUploadInfo);
  }

  static getUploadInfo(controller: any): IFileUploadMetadataInfo[] {
    return MetadataInfo.getClassMetadata(ControllerMetadata.CONTROLLER_UPLOAD_INFO, controller) || [];
  }

  static setOpenApiInfo(controller: any, openAPIInfo: IOpenAPIMetadataInfo) {
    const existingOpenAPIs = ControllerMetadata.getOpenApiInfo(controller);
    existingOpenAPIs.push(openAPIInfo);

    MetadataInfo.setClassMetadata(ControllerMetadata.CONTROLLER_OPEN_API, controller, existingOpenAPIs);
  }

  static getOpenApiInfo(controller: any): IOpenAPIMetadataInfo[] {
    return MetadataInfo.getClassMetadata(ControllerMetadata.CONTROLLER_OPEN_API, controller) || [];
  }
}
