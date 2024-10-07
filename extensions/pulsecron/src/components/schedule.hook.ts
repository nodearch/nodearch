import { Hook, IHook, Logger } from '@nodearch/core';
import { SchedulerRegistry } from './scheduler.registry.js';


@Hook({ export: true })
export class SchedulerHook implements IHook {
  constructor(
    private schedulerService: SchedulerRegistry,
    private logger: Logger
  ) {}

  async onStart() {
    this.logger.info('Starting Scheduler...');
    
    try {
      await this.schedulerService.start();
      this.logger.info('Scheduler Started');
    }
    catch(err) {
      this.logger.error('Error starting scheduler', err);
    }
  }

  async onStop() {
    await this.schedulerService.stop();
    this.logger.info('Scheduler Stopped');
  }
}
