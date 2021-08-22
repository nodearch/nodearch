import { ComponentType, Hook, HookContext, IHook } from '@nodearch/core';
import { WorkerService } from './service';
import { Task1 } from './task1';

@Hook()
export class WorkerHook implements IHook {
  
  constructor(private readonly worker: WorkerService) {}

  async onStart(context: HookContext) {
    this.worker.start();
  }

}