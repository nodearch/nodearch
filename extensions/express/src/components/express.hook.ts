import { Hook, IHook, HookContext, ComponentType, Logger, ClassConstructor } from '@nodearch/core';
import { ExpressService } from './express.service';

@Hook({
  export: true
})
export class ExpressHook implements IHook {

  private readonly expressService: ExpressService;
  private readonly logger: Logger;
  private controllers?: ClassConstructor[];

  constructor(expressService: ExpressService, logger: Logger) {
    this.expressService = expressService;
    this.logger = logger;
  }

  async onInit(context: HookContext) {
    try {
      this.controllers = context.getComponents(ComponentType.Controller);
    }
    catch(e) {
      this.logger.warn('Express: No controllers loaded!');
    }

    if (this.controllers) {
      await this.expressService.init(this.controllers, this.dependencyFactory(context));
    }
  }

  async onStart(context: HookContext) {
    if (this.controllers) {
      await this.expressService.start();
    }
  }

  async onStop() {
    this.expressService.stop();
  }

  private dependencyFactory(context: HookContext) {
    return (dependency: any) => {
      return context.get(dependency);
    }
  }
}