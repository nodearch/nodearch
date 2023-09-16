import { ComponentScope } from '@nodearch/core';
import { Middleware } from './decorators.js';
import { IExpressMiddlewareHandlerOptions, IMiddleware } from './interfaces.js';


@Middleware({ export: true, scope: ComponentScope.SINGLETON })
export class ExpressMiddleware implements IMiddleware {
  async handler(data: IExpressMiddlewareHandlerOptions) {
    const expressMiddleware = data.options;
    
    await new Promise((resolve, reject) => {

      expressMiddleware(data.args.req, data.args.res, (err?: any) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(true);
        }
      });

    });

  }
}