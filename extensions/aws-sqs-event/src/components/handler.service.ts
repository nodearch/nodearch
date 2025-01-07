import { AppContext, Service } from '@nodearch/core';
import { ClientSQSDecorator } from '../enums.js';
import { ISQSEvent, ISQSEventHandler, ISQSEventOptions } from '../interfaces.js';
import { SQSEventConfig } from './sqs.config.js';
import { Message } from '@aws-sdk/client-sqs';
import { EventMatchingService } from './event-matching.service.js';

@Service()
export class HandlerService {
  
  private handlers: ISQSEventHandler[];

  constructor(
    private appContext: AppContext,
    private config: SQSEventConfig,
    private eventMatchingService: EventMatchingService
  ) {
    this.handlers = [];
  }

  init() {
    this.getQueueHandlers();
  }

  getHandler(message: Message) {
    return this.eventMatchingService.matchEvent(message, this.handlers);
  }

  count() {
    return this.handlers.length;
  }

  private getQueueHandlers() {
    const componentsInfo = this.appContext.getComponentRegistry()
      .get<ISQSEvent, ISQSEventOptions>({ id: ClientSQSDecorator.SQSEvent });
     
    this.handlers = componentsInfo
      .filter((componentInfo) => {
        return componentInfo.getData()!.id === this.config.id;
      })
      .map((componentInfo) => {
        return {
          match: componentInfo.getData()!.match,
          componentInfo: componentInfo
        };
      });
  }
}