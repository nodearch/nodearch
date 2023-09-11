import express from 'express';
import { AppContext, Logger, Service } from '@nodearch/core';
import { IExpressInfo, IExpressRoute, IExpressRouter } from './interfaces.js';
import { RouteHandler } from './route-handler.js';
import { MiddlewareFactory } from '../middleware/middleware-factory.js';
import { ExpressParser } from './express-parser.js';
import { ExpressConfig } from './express.config.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ClassConstructor } from '@nodearch/core/utils';


/**
 * TODO
 * validation 
 * upload
 * expose new stuff in index.ts
 * start the server
 * add express commands
 */

@Service()
export class ExpressApp {

  constructor(
    private readonly routeHandler: RouteHandler,
    private readonly middlewareFactory: MiddlewareFactory,
    private readonly expressParser: ExpressParser,
    private readonly expressConfig: ExpressConfig,
    private readonly appContext: AppContext,
    private readonly logger: Logger
  ) {}

  create(): express.Application {
    const app = express();
    const expressInfo = this.expressParser.getExpressInfo();

    this.registerStatic(app);
    this.registerRouter(expressInfo, app);

    return app;
  }

  private registerStatic(app: express.Application) {
    if (this.expressConfig.static) {
      const rootDirPath = fileURLToPath(this.appContext.getSettings().paths.rootDir);
      
      this.expressConfig.static.forEach(staticItem => {
        let filePath =  staticItem.filePath;
        
        if (!path.isAbsolute(filePath)) {
          filePath = path.join(rootDirPath, filePath);
        }

        app.use(staticItem.httpPath, express.static(filePath, staticItem.options));
      });
    }
  }

  private registerRouter(expressInfo: IExpressInfo, app: express.Application) {
    expressInfo.routers.forEach(routerInfo => {
      app.use(routerInfo.path, this.createRouter(routerInfo));
    });
  }

  private createRouter(routerInfo: IExpressRouter) {
    const router = express.Router();

    router.use(this.middlewareFactory.defaultRouterMiddleware(routerInfo.controllerInfo));

    this.middlewareFactory.createExpressMiddleware(routerInfo.middleware)
      .forEach(middleware => {
        router.use(middleware);
      });

    const controllerClass = routerInfo.controllerInfo.getClass();

    routerInfo.routes.forEach(routeInfo => {
      this.registerRoute(router, routerInfo, routeInfo, controllerClass);
    });

    return router;
  }

  private registerRoute(router: express.Router, routerInfo: IExpressRouter, routeInfo: IExpressRoute, controllerClass: ClassConstructor) {
    const routeMiddleware = this.middlewareFactory.createExpressMiddleware(routeInfo.middleware);
    
    const routeParams = [
      ...routeMiddleware,
      this.routeHandler.create(routeInfo.controllerMethod, routeInfo.inputs)
    ];

    router[routeInfo.method](routeInfo.path, ...routeParams);
    
    const middlewareCount = routerInfo.middleware.length + routeMiddleware.length;
    this.logger.info(this.createRouteRegisterMsg(routerInfo, routeInfo, controllerClass, middlewareCount));
  }

  private createRouteRegisterMsg(routerInfo: IExpressRouter, routeInfo: IExpressRoute, controllerClass: ClassConstructor, middlewareCount: number) {
    const routeMethod = `[${routeInfo.method.toUpperCase()}]`; 
    const routePath = `${routerInfo.path}${routeInfo.path}`;
    const controllerMethod = `(${controllerClass.name}.${routeInfo.controllerMethod})`;
    return `Route: ${routeMethod} ${routePath} ${controllerMethod} - Middleware: ${middlewareCount}`;
  }

}