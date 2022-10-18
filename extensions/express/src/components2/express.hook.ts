import { Hook, HookContext, IHook, Logger } from '@nodearch/core';

@Hook({ export: true })
export class ExpressHook implements IHook {

  constructor(
    private readonly logger: Logger
  ) {}

  async onInit(context: HookContext) {
    
  }

  async onStart(context: HookContext) {}

  async onStop() {}

}