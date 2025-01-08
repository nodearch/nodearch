import { AppContext, Service } from '@nodearch/core';
import { ClientSqsDecorator } from '../enums.js';
import { ISqsEvent, ISqsEventHandler, ISqsEventOptions } from '../interfaces.js';
import { SqsEventConfig } from './sqs.config.js';
import { Message } from '@aws-sdk/client-sqs';
import { EventMatchingService } from './event-matching.service.js';

@Service()
export class HandlerService {
  
  private handlers: ISqsEventHandler[];

  constructor(
    private appContext: AppContext,
    private config: SqsEventConfig,
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
      .get<ISqsEvent, ISqsEventOptions>({ id: ClientSqsDecorator.SqsEvent });
     
    this.handlers = componentsInfo
      .filter((componentInfo) => {
        return componentInfo.getData()!.id === this.config.id;
      })
      .map((componentInfo) => {
        return {
          match: componentInfo.getData()!.match || [],
          componentInfo: componentInfo
        };
      });
  }
}