import { Hook, HookContext, IHook } from '@nodearch/core';
import { MochaAnnotation } from '../enums';
import { MochaService } from './mocha.service';


@Hook({
  export: true
})
export class MochaHook implements IHook {
  
  constructor(private mochaService: MochaService) {}

  async onInit(context: HookContext) {
    const container = context.getContainer();
    const testComponents = context.getComponents(MochaAnnotation.Test);
    const mockComponents = context.getComponents(MochaAnnotation.Mock);

    if (testComponents) {
      this.mochaService.init(container, testComponents, mockComponents);
    }

  }

  async onStart(context: HookContext) {
    await this.mochaService.run();
  }
}