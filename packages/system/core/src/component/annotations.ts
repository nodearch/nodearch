import { multiInject } from 'inversify';


export function InjectNs(namespace: string): ParameterDecorator {
  return function (target: any, key: string | symbol, index: number) {
    multiInject(namespace)(target, <string>key, index);
  }
}