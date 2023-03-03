import { Hook, IHook } from '@nodearch/core';
import { SwaggerOptions } from './swagger-options.js';


@Hook({ export: true })
export class SwaggerHook implements IHook {

  constructor(
    private readonly swaggerOptions: SwaggerOptions
  ) {}

  async onStart() {
    await this.swaggerOptions.set();
  }
}