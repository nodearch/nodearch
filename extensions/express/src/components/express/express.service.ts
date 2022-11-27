import express from 'express';
import { Service } from '@nodearch/core';
import { IExpressInfo, IExpressRoute, IExpressRouter } from './interfaces';
import { RouteHandler } from './route-handler';
import { MiddlewareFactory } from '../middleware/middleware-factory';


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

  private routeHandler: RouteHandler;
  private middlewareFactory: MiddlewareFactory;
  private app: express.Application;

  constructor(
    routeHandler: RouteHandler,
    middlewareFactory: MiddlewareFactory
  ) {
    this.routeHandler = routeHandler;
    this.middlewareFactory = middlewareFactory;
    this.app = express();
  }

  init(expressInfo: IExpressInfo) {
    
    expressInfo.routers.forEach(routerInfo => {
      this.app.use(routerInfo.path, this.createRouter(routerInfo));
    });
    

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
    const routeMiddleware = this.middlewareFactory.createExpressMiddleware(routeInfo.middleware);;
    router[routeInfo.method](
      routeInfo.path, 
      ...routeMiddleware, 
      this.routeHandler.create(routeInfo.controllerMethod, routeInfo.inputs)
    );
  }

}