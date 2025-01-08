import { Service } from '@nodearch/core';
import * as utils from '@nodearch/core/utils';
import { ISqsEventHandler, ISqsEventMatching } from '../interfaces.js';
import { Message } from '@aws-sdk/client-sqs';
import { SqsMatching } from '../enums.js';

@Service()
export class EventMatchingService {

  matchEvent(event: Message, handlers: ISqsEventHandler[]) {

    // deep clone the message
    const eventMessage = JSON.parse(JSON.stringify(event)) as Message;

    // Find first matching handler
    const foundHandlers = handlers.filter((handler) => {
      return this.match(eventMessage, handler.match);
    });

    if (foundHandlers.length > 1) {
      throw new Error(`Found multiple handlers for the event`);
    }

    return foundHandlers[0];
  }

  private match(event: Message, match: ISqsEventMatching[]) {
    return match.every((m) => {
      return this.matchOne(event, m);
    });
  }

  private matchOne(event: Message, match: ISqsEventMatching) {
    const messageValue = utils.get(event, match.path);

    if (messageValue === undefined || messageValue === null) {
      return false;
    }

    let isMatch = false;

    switch (match.operation) {
      case SqsMatching.EQUALS:
        isMatch = messageValue === match.value;
        break;
      case SqsMatching.NOT_EQUALS:
        isMatch = messageValue !== match.value;
        break;
      case SqsMatching.CONTAINS:
        isMatch = messageValue.includes(match.value);
        break;
      case SqsMatching.STARTS_WITH:
        isMatch = messageValue.startsWith(match.value);
        break;
      case SqsMatching.ENDS_WITH:
        isMatch = messageValue.endsWith(match.value);
        break;
      case SqsMatching.GREATER_THAN:
        isMatch = messageValue > match.value;
        break;
      case SqsMatching.LESS_THAN:
        isMatch = messageValue < match.value;
        break;
      case SqsMatching.GREATER_THAN_OR_EQUAL:
        isMatch = messageValue >= match.value;
        break;
      case SqsMatching.LESS_THAN_OR_EQUAL:
        isMatch = messageValue <= match.value;
        break;
      case SqsMatching.EXIST:
        isMatch = messageValue !== undefined;
        break;
      case SqsMatching.NOT_EXIST:
        isMatch = messageValue === undefined;
        break;
    }

    return isMatch;
  }

}