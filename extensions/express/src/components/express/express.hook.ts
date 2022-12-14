import { Hook, IHook } from '@nodearch/core';
import { ExpressService } from './express.service';


@Hook({ export: true })
export class ExpressHook implements IHook {
  
  constructor(
    private readonly expressService: ExpressService
  ) {}

  async onStart() {
    await this.expressService.start();
  }

}