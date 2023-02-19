import { Hook, IHook } from '@nodearch/core';

@Hook()
export class FirstHook implements IHook {
  async onStart() {
    console.log('Standalone APP - FirstHook.onStart');
  }
}