import { Hook, IHook } from '@nodearch/core';
import { ExpressServer } from './express-server';


@Hook({ export: true })
export class ExpressHook implements IHook {
  
  constructor(
    private readonly expressServer: ExpressServer
  ) {}

  async onStart() {
    await this.expressServer.start();
  }

  // TODO: onStop ?
}