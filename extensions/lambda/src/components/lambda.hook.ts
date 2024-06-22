import { AppContext, Hook, IHook } from '@nodearch/core';
import { LambdaDecorator } from '../enums.js';
import { RegistryService } from './registry.service.js';

@Hook({ export: true })
export class LambdaHook implements IHook {
  
  constructor(
    private registryService: RegistryService
  ) {}

  async onStart() {
    // this.registryService.load();
  }
}