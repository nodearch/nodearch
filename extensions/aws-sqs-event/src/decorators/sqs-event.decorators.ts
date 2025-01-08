import { ComponentFactory, IComponentOptions } from '@nodearch/core/components';
import { ClientSqsDecorator } from '../enums.js';
import { ISqsEventOptions } from '../interfaces.js';


export const SQSEvent = (options: ISqsEventOptions, componentOptions?: IComponentOptions): ClassDecorator =>
  ComponentFactory.componentDecorator({
    id: ClientSqsDecorator.SqsEvent,
    options: {
      ...(componentOptions || {}),
    },
    fn: () => {
      return options;
    }
  });