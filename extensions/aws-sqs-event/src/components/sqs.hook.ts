import { Hook, IHook, Logger } from '@nodearch/core';
import { SQSEventConfig } from './sqs.config.js';
import { HandlerService } from './handler.service.js';
import { SQSService } from './sqs.service.js';

@Hook({ export: true })
export class SQSHook implements IHook {

  constructor(
    private config: SQSEventConfig,
    private logger: Logger,
    private handlerService: HandlerService,
    private sqsService: SQSService
  ) {}

  async onStart() {
    if (this.config.enabled) {
      this.handlerService.init();
      const listenersCount = this.handlerService.count();

      if (!listenersCount) {
        this.logger.warn(`No Listeners found. Polling will not start.`);
      }
      else {
        this.sqsService.poll();
        this.logger.info(`Polling Started - Listeners: ${listenersCount}`);
      }
    }
  }

  async onStop() {
    if (this.config.enabled) {
      this.sqsService.stop();
      this.logger.info(`Polling Stopped`);
    }
  }
}
