import { Service, Logger } from '@nodearch/core';
import { HttpControllerInfo } from './http-controller-info';
import { ValidationHandlerFactory } from './validation-handler.factory';
import { IMiddlewareMetadataInfo, IHttpControllerMethod, IValidationMetadataInfo, IRouteInfo, IFileUploadMetadataInfo, IFileUploadInfo } from '../interfaces';
import { MiddlewareHandler } from '../types';
import { RouteHandlerFactory } from './route-handler.factory';
import express from 'express';
import { MiddlewareService } from './middleware.service';
import { FileUploadHandlerFactory } from './file-upload-handler.factory';
import { OpenAPIService } from './openapi/openapi.service';

@Service()
export class RoutesService {
  private httpControllerInfo: HttpControllerInfo;
  private validationHandlerFactory: ValidationHandlerFactory;
  private routeHandlerFactory: RouteHandlerFactory;
  private fileUploadHandlerFactory: FileUploadHandlerFactory;
  private middlewareService: MiddlewareService;
  private openAPIService: OpenAPIService;
  private logger: Logger;
  routesInfo: IRouteInfo[];

  constructor(
    httpControllerInfo: HttpControllerInfo,
    validationHandlerFactory: ValidationHandlerFactory,
    routeHandlerFactory: RouteHandlerFactory,
    fileUploadHandlerFactory: FileUploadHandlerFactory,
    middlewareService: MiddlewareService,
    openAPIService: OpenAPIService,
    logger: Logger
  ) {
    this.httpControllerInfo = httpControllerInfo;
    this.validationHandlerFactory = validationHandlerFactory;
    this.routeHandlerFactory = routeHandlerFactory;
    this.fileUploadHandlerFactory = fileUploadHandlerFactory;
    this.middlewareService = middlewareService;
    this.openAPIService = openAPIService;
    this.logger = logger;
    this.routesInfo = [];
  }

  registerController(controller: any, expressApp: express.Application, dependencyFactory: (x: any) => any) {
    // parse http info from controller
    const httpCtrlInfo = this.httpControllerInfo.parse(controller);
    const middlewaresMetadataInfo = this.middlewareService.getMiddlewares(controller.constructor);
    const controllerValidationInfo = this.validationHandlerFactory.getControllerValidationInfo(controller.constructor);
    const fileUploadInfo = this.fileUploadHandlerFactory.getFileUploadInfo(controller.constructor);

    httpCtrlInfo.methods.forEach(methodInfo => this.registerMethod(
      controller,
      middlewaresMetadataInfo,
      methodInfo,
      controllerValidationInfo,
      fileUploadInfo,
      expressApp,
      dependencyFactory
    ));
  }

  private registerMethod(
    controller: any,
    middlewaresMetadataInfo: IMiddlewareMetadataInfo[],
    methodInfo: IHttpControllerMethod,
    controllerValidationInfo: IValidationMetadataInfo[],
    fileUploadInfo: IFileUploadMetadataInfo[],
    expressApp: express.Application,
    dependencyFactory: (x: any) => any
  ) {
    const middlewares = this.middlewareService.getMethodMiddlewares(middlewaresMetadataInfo, methodInfo.name, dependencyFactory);

    const validationInfo = controllerValidationInfo.find(x => x.method === methodInfo.name);
    const fileUpload = fileUploadInfo.find(x => x.method === methodInfo.name);
    const openApiInfo = this.openAPIService.getOpenApiInfo(controller, methodInfo.name);

    let validationHandler, uploadHandler;

    if(fileUpload) {
      uploadHandler = this.fileUploadHandlerFactory.createHandler(fileUpload.uploadInfo);
    }

    if (validationInfo) {
      // create Validation Handler
      validationHandler = this.validationHandlerFactory
        .createHandler(validationInfo.validation);
    }

    // create express route handler for every controller method
    const handler = this.routeHandlerFactory
      .createHandler(controller.constructor, methodInfo, dependencyFactory);

    // construct a clean handlers array ( remove null/undefined )
    const handlers: MiddlewareHandler[] = <MiddlewareHandler[]>[
      ...middlewares,
      uploadHandler,
      validationHandler,
      handler
    ].filter(x => x);

    this.routesInfo.push({
      methodName: methodInfo.name,
      httpInfo: methodInfo,
      validation: validationInfo?.validation,
      fileUpload: <IFileUploadInfo[]> fileUpload?.uploadInfo.files,
      openApiInfo
    });

    this.logger.info(`Express: Register HTTP Route - ${methodInfo.httpMethod.toUpperCase()} ${methodInfo.httpPath} - Middlewares: ${middlewares.length}, Validation: ${validationHandler ? 'YES' : 'NO'}`);

    // assign created handler to the express insatnce
    expressApp[methodInfo.httpMethod](methodInfo.httpPath, ...handlers);
  }
}