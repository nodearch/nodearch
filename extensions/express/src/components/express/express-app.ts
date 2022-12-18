import express from 'express';
import { Service } from '@nodearch/core';
import { IExpressInfo, IExpressRoute, IExpressRouter } from './interfaces';
import { RouteHandler } from './route-handler';
import { MiddlewareFactory } from '../middleware/middleware-factory';
import { ExpressParser } from './express-parser';
import { ExpressConfig } from './express.config';
import path from 'path';


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
    private readonly expressConfig: ExpressConfig
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
      this.expressConfig.static.forEach(staticDir => {
        if (!path.isAbsolute(staticDir.root)) {
          // TODO: use the app root directory instead of CWD, perhaps passing it via the AppContext
          staticDir.root = path.join(process.cwd(), staticDir.root);
        }

        app.use(staticDir.path, express.static(staticDir.root, staticDir.options));
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