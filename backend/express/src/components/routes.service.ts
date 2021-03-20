import { Service, Logger } from '@nodearch/core';
import { HttpControllerInfo } from './http-controller-info';
import { IHttpControllerMethod, IRouteInfo, IFileUploadInfo, IMiddlewareInfo } from '../interfaces';
import { RouteHandlerFactory } from './route-handler.factory';
import express from 'express';
import { MiddlewareService } from './middleware.service';
import { OpenAPIService } from './openapi/openapi.service';
import { MiddlewareType } from '../enums';


@Service()
export class RoutesService {
  private httpControllerInfo: HttpControllerInfo;
  private routeHandlerFactory: RouteHandlerFactory;
  private middlewareService: MiddlewareService;
  private openAPIService: OpenAPIService;
  private logger: Logger;
  routesInfo: IRouteInfo[];

  constructor(
    httpControllerInfo: HttpControllerInfo,
    routeHandlerFactory: RouteHandlerFactory,
    middlewareService: MiddlewareService,
    openAPIService: OpenAPIService,
    logger: Logger
  ) {
    this.httpControllerInfo = httpControllerInfo;
    this.routeHandlerFactory = routeHandlerFactory;
    this.middlewareService = middlewareService;
    this.openAPIService = openAPIService;
    this.logger = logger;
    this.routesInfo = [];
  }

  registerController(controller: any, expressApp: express.Application, dependencyFactory: (x: any) => any) {
    const httpCtrlInfo = this.httpControllerInfo.parse(controller);
    const middlewareInfo = this.middlewareService.getMiddleware(controller);

    httpCtrlInfo.methods.forEach(methodInfo => {
      const methodMiddlewareSet = this.middlewareService.getMethodMiddleware(middlewareInfo, methodInfo.name);
      
      this.registerMethod(
        controller,
        methodMiddlewareSet,
        methodInfo,
        expressApp,
        dependencyFactory
      )
    });
  }

  private registerMethod(
    controller: any,
    methodMiddlewareSet: IMiddlewareInfo[],
    methodInfo: IHttpControllerMethod,
    expressApp: express.Application,
    dependencyFactory: (x: any) => any
  ) {
    // TODO: do not load this unless we need it in the CLI
    const openApiInfo = this.openAPIService.getOpenApiInfo(controller, methodInfo.name);

    // create express route handler for every controller method
    const handler = this.routeHandlerFactory
      .createHandler(controller, methodInfo, methodMiddlewareSet, dependencyFactory);

    const validationMiddleware = methodMiddlewareSet.find(x => x.type === MiddlewareType.VALIDATION);
    const fileUploadMiddleware = methodMiddlewareSet.find(x => x.type === MiddlewareType.FILE_UPLOAD);

    this.routesInfo.push({
      methodName: methodInfo.name,
      httpInfo: methodInfo,
      validation: validationMiddleware?.metadata,
      fileUpload: <IFileUploadInfo[]> fileUploadMiddleware?.metadata.files,
      openApiInfo
    });

    this.logger.info(`Express: Register HTTP Route - ${methodInfo.httpMethod.toUpperCase()} ${methodInfo.httpPath} - Middleware: ${methodMiddlewareSet.length}`);

    // // assign created handler to the express instance
    expressApp[methodInfo.httpMethod](methodInfo.httpPath, handler);
  }
}