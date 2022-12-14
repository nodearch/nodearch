import express from 'express';
import { AppContext, Service } from '@nodearch/core';
import { IExpressInfo, IExpressRoute, IExpressRouter } from './interfaces';
import { RouteHandler } from './route-handler';
import { MiddlewareFactory } from '../middleware/middleware-factory';
import { ExpressServer } from './express-server';
import { ExpressAnnotationId } from './enums';
import { ExpressParser } from './express-parser';


/**
 * TODO
 * validation 
 * upload
 * openapi
 * expose new stuff in index.ts
 * start the server
 * add express commands
 */

@Service()
export class ExpressService {

  public expressInfo: IExpressInfo;

  private routeHandler: RouteHandler;
  private middlewareFactory: MiddlewareFactory;
  private expressServer: ExpressServer;
  private expressParser: ExpressParser;

  constructor(
    routeHandler: RouteHandler,
    middlewareFactory: MiddlewareFactory,
    expressServer: ExpressServer,
    expressParser: ExpressParser,  
    appContext: AppContext
  ) {
    this.routeHandler = routeHandler;
    this.middlewareFactory = middlewareFactory;
    this.expressServer = expressServer;
    this.expressParser = expressParser;
    this.expressInfo = { routers: [] };

    const componentsInfo = appContext.getComponents(ExpressAnnotationId.HttpController);

    if (componentsInfo) {
      this.expressInfo = this.expressParser.parse(componentsInfo);

      this.expressInfo.routers.forEach(routerInfo => {
        this.expressServer.expressApp.use(routerInfo.path, this.createRouter(routerInfo));
      });
    }
  }

  async start() {
    await this.expressServer.start();
  }

  private createRouter(routerInfo: IExpressRouter) {
    const router = express.Router();

    router.use(this.middlewareFactory.defaultRouterMiddleware(routerInfo.controllerInfo));

    this.middlewareFactory.createExpressMiddleware(routerInfo.middleware)
      .forEach(middleware => {
        router.use(middleware);
      });

    routerInfo.routes.forEach(routeInfo => {
      this.registerRoute(router, routeInfo);
    });

    return router;
  }

  private registerRoute(router: express.Router, routeInfo: IExpressRoute) {
    const routeMiddleware = this.middlewareFactory.createExpressMiddleware(routeInfo.middleware);
    router[routeInfo.method](
      routeInfo.path, 
      ...routeMiddleware, 
      this.routeHandler.create(routeInfo.controllerMethod, routeInfo.inputs)
    );
  }

}