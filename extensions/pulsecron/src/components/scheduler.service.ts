import { Service } from '@nodearch/core';
import { SchedulerRegistry } from './scheduler.registry.js';

@Service()
export class SchedulerService {
  constructor(
    private schedulerRegistry: SchedulerRegistry
  ) {}

  // schedule(when: string | Date, names: string | string[], data?: any) {}

  // every(interval: string | number, names: string | string[], data?: any) {}

}