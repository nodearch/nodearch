import { CoreAnnotation, Hook, HookContext, IHook } from '@nodearch/core';
import { OpenAPI } from '@nodearch/openapi';

@Hook()
export class TestHook implements IHook {
  async onStart(context: HookContext) {
    const comps = context.get(OpenAPI);
    console.log( comps );
  }
}