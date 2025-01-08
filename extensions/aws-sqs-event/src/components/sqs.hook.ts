import { Hook, IHook, Logger } from '@nodearch/core';
import { SqsEventConfig } from './sqs.config.js';
import { HandlerService } from './handler.service.js';
import { SqsService } from './sqs.service.js';

@Hook({ export: true })
export class SqsHook implements IHook {

  constructor(
    private config: SqsEventConfig,
    private logger: Logger,
    private handlerService: HandlerService,
    private sqsService: SqsService
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
