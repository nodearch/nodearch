import express from 'express';
import { AppContext, Logger, Service } from '@nodearch/core';
import { IExpressInfo, IExpressRoute, IExpressRouter, IHttpLogger } from './interfaces.js';
import { RouteHandler } from './route-handler.js';
import { MiddlewareFactory } from '../middleware/middleware-factory.js';
import { ExpressParser } from './express-parser.js';
import { ExpressConfig } from './express.config.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ClassConstructor } from '@nodearch/core/utils';


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

    this.registerResponseTimer(app);
    this.registerHttpLogger(app);
    this.registerParsers(app);
    this.registerGlobalMiddleware(app);
    this.registerStatic(app);
    this.registerRouter(expressInfo, app);

    return app;
  }

  private registerResponseTimer(app: express.Application) {
    if (this.expressConfig.httpLogger.enable && this.expressConfig.httpLogger.showDuration) {
      app.use((req, res, next) => {
        const start = process.hrtime();
  
        res.on('finish', () => {
          const durationInMs = this.getDurationInMs(start);
          req.nodearch = req.nodearch || {};
          req.nodearch.responseTime = durationInMs;
        });

        next();
      });
    }
  }

  private registerHttpLogger(app: express.Application) {
    if (this.expressConfig.httpLogger.enable) {
      app.use((req, res, next) => {

        if (this.isRouteExcluded(req, this.expressConfig.httpLogger)) {
          next();
          return;
        }

        res.on('finish', () => {
          const message = this.getHttpLoggerMessage(req, res, this.expressConfig.httpLogger);
          this.logger.info(message);
        });

        next();
      });
    }
  }

  private isRouteExcluded(req: express.Request, config: IHttpLogger) {
    if (
      !config.excludeRoutes || 
      !config.excludeRoutes.length || 
      typeof config.excludeRoutes !== 'function'
    ) {
      return false;
    }

    if (Array.isArray(config.excludeRoutes)) {
      return config.excludeRoutes
        .some(
          route => route.method.toLowerCase() === req.method.toLowerCase() && route.path === req.originalUrl
        );
    }
    else {
      return config.excludeRoutes(req);
    }
  }

  private getHttpLoggerMessage(req: express.Request, res: express.Response, config: IHttpLogger) {
    let message = `[${req.method}] ${req.originalUrl}`;

    if (config.showHeaders) {
      message += ' - Headers: ';
      message += typeof config.showHeaders === 'function' ? 
        config.showHeaders(req.headers) : JSON.stringify(req.headers);
    }

    if (config.showBody) {
      message += ' - Body: ';
      message += typeof config.showBody === 'function' ? 
        config.showBody(req.body) : JSON.stringify(req.body);
    }

    if (config.showQuery) {
      message += ' - Query: ';
      message += typeof config.showQuery === 'function' ? 
        config.showQuery(req.query) : JSON.stringify(req.query);
    }

    if (config.showParams) {
      message += ' - Params: ';
      message += typeof config.showParams === 'function' ? 
        config.showParams(req.params) : JSON.stringify(req.params);
    }

    if (config.showCookies) {
      message += ' - Cookies: ';
      message += typeof config.showCookies === 'function' ? 
        config.showCookies(req.cookies) : JSON.stringify(req.cookies);
    }

    if (config.showStatus) {
      message += ` - Status: ${res.statusCode}`;
    }

    if (config.custom) {
      message += ` - ${config.custom(req)}`;
    }

    if (config.showDuration) {
      message += ` - Duration: ${req.nodearch.responseTime}ms`;
    }

    return message;
  }

  private getDurationInMs(start: [number, number]) {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
  }

  private registerParsers(app: express.Application) {
    this.expressConfig.jsonParser.enable && app.use(express.json(this.expressConfig.jsonParser.options));
    this.expressConfig.textParser.enable && app.use(express.text(this.expressConfig.textParser.options));
    this.expressConfig.urlencodedParser.enable && app.use(express.urlencoded(this.expressConfig.urlencodedParser.options));
  }

  private registerGlobalMiddleware(app: express.Application) {
    if (this.expressConfig.use) {
      this.expressConfig.use.forEach(middleware => {
        app.use(middleware);
      });
    }
  }

  private registerStatic(app: express.Application) {
    if (this.expressConfig.static) {
      const rootDirPath = fileURLToPath(this.appContext.getSettings().paths.rootDir);
      
      this.expressConfig.static.forEach(staticItem => {
        let filePath =  staticItem.filePath;
        
        if (filePath instanceof URL) {
          filePath = fileURLToPath(filePath);
        }

        if (!path.isAbsolute(filePath)) {
          filePath = path.join(rootDirPath, filePath);
        }

        app.use(staticItem.httpPath, express.static(filePath, staticItem.options));
        this.logger.info(`Static: ${staticItem.httpPath} -> ${filePath}`);
      });
    }
  }

  private registerRouter(expressInfo: IExpressInfo, app: express.Application) {
    expressInfo.routers.forEach(routerInfo => {
      app.use(routerInfo.path, this.createRouter(routerInfo));
    });
  }

  private createRouter(routerInfo: IExpressRouter) {
    const router = express.Router({ mergeParams: true });

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