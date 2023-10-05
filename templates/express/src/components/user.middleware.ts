import { Middleware } from '@nodearch/express';

@Middleware()
export class UserMiddleware {
  async handler() {
    // Do something
  }
}