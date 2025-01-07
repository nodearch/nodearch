import { ComponentFactory, IComponentOptions } from '@nodearch/core/components';
import { ClientSQSDecorator } from '../enums.js';
import { SQSEventOptions } from '../interfaces.js';


export const SQSEvent = (options: SQSEventOptions): ClassDecorator =>
  ComponentFactory.componentDecorator({ 
      id: ClientSQSDecorator.SQSEvent,
      options: {
        ...(options.componentOptions || {}),
      },
      fn: () => {
        return {
          match: options.match,
        };
      }
    });