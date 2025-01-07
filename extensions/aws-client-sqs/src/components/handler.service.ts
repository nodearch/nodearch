import { AppContext, Service } from '@nodearch/core';
import { ClientSQSDecorator } from '../enums.js';

@Service()
export class HandlerService {
  constructor(
    private appContext: AppContext
  ) {}

  private getHandlers() {
    const componentsInfo = this.appContext.getComponentRegistry().get({ id: ClientSQSDecorator.SQSEvent });
  }
}