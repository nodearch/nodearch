import { Middleware } from '@nodearch/express';

@Middleware()
export class FirstMiddleware {
  async handler() {
    // console.log('From handler X');
  }
}