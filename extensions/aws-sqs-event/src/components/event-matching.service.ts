import { Service } from '@nodearch/core';
import * as utils from '@nodearch/core/utils';
import { ISQSEventHandler, ISQSEventMatching } from '../interfaces.js';
import { Message } from '@aws-sdk/client-sqs';
import { SQSMatching } from '../enums.js';

@Service()
export class EventMatchingService {

  matchEvent(event: Message, handlers: ISQSEventHandler[]) {

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

  private match(event: Message, match: ISQSEventMatching[]) {
    return match.every((m) => {
      return this.matchOne(event, m);
    });
  }

  private matchOne(event: Message, match: ISQSEventMatching) {
    const messageValue = utils.get(event, match.path);

    if (messageValue === undefined || messageValue === null) {
      return false;
    }

    let isMatch = false;

    switch (match.operation) {
      case SQSMatching.EQUALS:
        isMatch = messageValue === match.value;
        break;
      case SQSMatching.NOT_EQUALS:
        isMatch = messageValue !== match.value;
        break;
      case SQSMatching.CONTAINS:
        isMatch = messageValue.includes(match.value);
        break;
      case SQSMatching.STARTS_WITH:
        isMatch = messageValue.startsWith(match.value);
        break;
      case SQSMatching.ENDS_WITH:
        isMatch = messageValue.endsWith(match.value);
        break;
      case SQSMatching.GREATER_THAN:
        isMatch = messageValue > match.value;
        break;
      case SQSMatching.LESS_THAN:
        isMatch = messageValue < match.value;
        break;
      case SQSMatching.GREATER_THAN_OR_EQUAL:
        isMatch = messageValue >= match.value;
        break;
      case SQSMatching.LESS_THAN_OR_EQUAL:
        isMatch = messageValue <= match.value;
        break;
      case SQSMatching.EXIST:
        isMatch = messageValue !== undefined;
        break;
      case SQSMatching.NOT_EXIST:
        isMatch = messageValue === undefined;
        break;
    }

    return isMatch;
  }

}