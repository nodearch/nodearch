import { multiInject } from 'inversify';
import { Container } from '../../components.index.js';


export function Ns(namespace: string): ParameterDecorator {
  return function (target: any, key: string | symbol | undefined, index: number) {
    multiInject(Container.getNamespaceId(namespace))(target, <string>key, index);
  }
}