import { ComponentFactory, IComponentOptions } from '@nodearch/core/components';
import { PulseDecorator } from './enums.js';
import { DefineOptions } from '@pulsecron/pulse';
import { ComponentScope } from '@nodearch/core';

// JobDefinition

export function JobDefinition(
  name: string,
  options?: DefineOptions,
  componentOptions?: Omit<IComponentOptions, 'scope'>
) {
  return ComponentFactory.componentDecorator({
    id: PulseDecorator.JOB,
    fn: () => ({ name, options }),
    options: {
      ...(componentOptions || {}),
      scope: ComponentScope.SINGLETON
    }
  });
}

