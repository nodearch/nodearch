import { Hook, IHook } from '@nodearch/core';

@Hook()
export class FirstHook implements IHook {
  async onInit() {
    // console.log('FirstHook onInit');
  }
}