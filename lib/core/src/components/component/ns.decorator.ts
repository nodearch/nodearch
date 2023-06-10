import { multiInject } from 'inversify';

export function Ns(namespace: string): ParameterDecorator {
  return function (target: any, key: string | symbol | undefined, index: number) {
    multiInject(namespace)(target, <string>key, index);
  }
}