import { AppContext, Hook, IHook } from '@nodearch/core';
import { JoiDecorator } from '../enums.js';

@Hook({ export: true })
export class JoiHook implements IHook {
  constructor(
    private readonly appContext: AppContext
  ) {}

  async onStart() {

  }
}