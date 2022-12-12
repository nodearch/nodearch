import { Hook, HookContext, IHook } from '@nodearch/core';
import { OpenAPIParser } from '../openapi/parser';
import { ExpressAnnotationId } from './enums';
import { ExpressParser } from './express-parser';
import { ExpressService } from './express.service';


@Hook({ export: true })
export class ExpressHook implements IHook {
  
  constructor(
    private readonly expressParser: ExpressParser,
    private readonly expressService: ExpressService,
    private readonly openAPIParser: OpenAPIParser
  ) {}

  async onInit(context: HookContext) {
    const componentsInfo = context.getComponents(ExpressAnnotationId.HttpController);
    
    if (componentsInfo) {
      const expressInfo = this.expressParser.parse(componentsInfo);
      this.expressService.init(expressInfo);
      this.openAPIParser.init(expressInfo);
    }

  }

  async onStart(context: HookContext) {
    await this.expressService.start();
  }

}