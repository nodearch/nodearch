import { Hook, HookContext, IHook } from '@nodearch/core';
import { ExpressAnnotationId } from './enums';
import { ExpressService } from './express.service';


@Hook({ export: true })
export class ExpressHook implements IHook {
  
  constructor(
    private readonly expressService: ExpressService
  ) {}

  async onInit(context: HookContext) {
    const componentsInfo = context.getComponents(ExpressAnnotationId.HttpController);
    
    if (componentsInfo) {
      this.expressService.init(componentsInfo);

      console.log(JSON.stringify(this.expressService.expressInfo, null, 2));
    }

  }

}