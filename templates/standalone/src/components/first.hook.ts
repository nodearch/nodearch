import { Hook, IHook } from '@nodearch/core';
import { SimpleService } from './simple.service.js';

@Hook()
export class FirstHook implements IHook {

  constructor(
    private readonly simpleService: SimpleService
  ) {}

  async onStart() {
    try {
      const result = this.simpleService.sum(Math.random() * 100, Math.random() * 100);
      const result2 = this.simpleService.sum2(Math.random() * 100, Math.random() * 100);
      console.log('Standalone APP - FirstHook.onStart - result', Math.floor(result));
    }
    catch (error) {
      console.log('Standalone APP - FirstHook.onStart - error', error);
    }

  }
}