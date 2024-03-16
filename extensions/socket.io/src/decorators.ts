import { ComponentFactory, IComponentOptions } from '@nodearch/core/components';
import { SocketIODecorator } from './enums.js';
import { NamespaceName } from './interfaces.js';
import { ClassConstructor } from '@nodearch/core/utils';


export function Subscribe(eventName: string) {
  return ComponentFactory.methodDecorator({ id: SocketIODecorator.SUBSCRIBE, fn: () => ({ eventName }) });
}

export function NamespaceProvider(name: NamespaceName, options?: IComponentOptions) {
  return ComponentFactory.componentDecorator({ id: SocketIODecorator.NAMESPACE_PROVIDER, options, fn: () => ({ name }) });
}

export function Namespace(namespaceProvider: ClassConstructor<any>) {
  // TODO: add type checking for namespaceProvider
  return ComponentFactory.classMethodDecorator({ 
    id: SocketIODecorator.NAMESPACE, 
    fn: () => ({ namespaceProvider: namespaceProvider }) 
  });
}

export function SocketInfo() {
  return ComponentFactory.parameterDecorator({ id: SocketIODecorator.SOCKET_INFO });
}

export function EventData(index?: number) {
  return ComponentFactory.parameterDecorator({ id: SocketIODecorator.EVENT_DATA, fn: () => ({ index }) });
}