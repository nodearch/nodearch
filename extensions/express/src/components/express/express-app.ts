import express from 'express';
import { AppContext, Service } from '@nodearch/core';
import { IExpressInfo, IExpressRoute, IExpressRouter } from './interfaces.js';
import { RouteHandler } from './route-handler.js';
import { MiddlewareFactory } from '../middleware/middleware-factory.js';
import { ExpressParser } from './express-parser.js';
import { ExpressConfig } from './express.config.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';


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
export class ExpressApp {

  constructor(
    private readonly routeHandler: RouteHandler,
    private readonly middlewareFactory: MiddlewareFactory,
    private readonly expressParser: ExpressParser,
    private readonly expressConfig: ExpressConfig,
    private readonly appContext: AppContext
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
      const rootDirPath = fileURLToPath(this.appContext.appInfo.paths.rootDir);
      
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