import { Hook, HookContext, IHook } from '@nodearch/core';
import { OpenAPI } from '@nodearch/openapi';
import { SwaggerConfig } from './swagger.config';

@Hook({ export: true })
export class SwaggerHook implements IHook {

  constructor(
    private readonly swaggerConfig: SwaggerConfig
  ) {}

  async onStart(context: HookContext) {
    const openAPI = context.get<OpenAPI>(this.swaggerConfig.openAPI);

    if (openAPI) {
      console.log('openapi', JSON.stringify(openAPI.get(), null, 2));
    }
  }
}