import { ComponentFactory, IComponentOptions } from '@nodearch/core/components';
import { ClientSQSDecorator } from '../enums.js';
import { ISQSEventOptions } from '../interfaces.js';


export const SQSEvent = (options: ISQSEventOptions, componentOptions?: IComponentOptions): ClassDecorator =>
  ComponentFactory.componentDecorator({
    id: ClientSQSDecorator.SQSEvent,
    options: {
      ...(componentOptions || {}),
    },
    fn: () => {
      return options;
    }
  });