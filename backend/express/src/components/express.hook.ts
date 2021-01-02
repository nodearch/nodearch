import { Hook, IHook, HookContext, ComponentType, Logger } from '@nodearch/core';
import { ExpressService } from './express.service';

@Hook()
export class ExpressHook implements IHook {

  private readonly expressService: ExpressService;
  private readonly logger: Logger;
  private controllers?: any[];

  constructor(expressService: ExpressService, logger: Logger) {
    this.expressService = expressService;
    this.logger = logger;
  }

  async onInit(context: HookContext) {
    try {
      this.controllers = context.getAll(ComponentType.Controller);
    }
    catch(e) {
      this.logger.warn('Express: No controllers loaded!');
    }

    if (this.controllers?.length) {
      await this.expressService.init(this.controllers, this.dependencyFactory(context));
    }
  }

  async onStart() {
    if (this.controllers?.length) {
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