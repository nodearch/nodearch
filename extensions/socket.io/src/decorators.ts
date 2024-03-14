import { ComponentFactory, IComponentOptions } from '@nodearch/core/components';
import { SocketIODecorator } from './enums.js';
import { NamespaceName } from './interfaces.js';


export function Subscribe(eventName: string) {
  return ComponentFactory.methodDecorator({ id: SocketIODecorator.SUBSCRIBE, fn: () => ({ eventName }) });
}

export function Namespace(name: NamespaceName, options?: IComponentOptions) {
  return ComponentFactory.componentDecorator({ id: SocketIODecorator.NAMESPACE, options, fn: () => ({ name }) });
}

export function SocketInfo() {
  return ComponentFactory.parameterDecorator({ id: SocketIODecorator.SOCKET_INFO });
}

export function EventData() {
  return ComponentFactory.parameterDecorator({ id: SocketIODecorator.EVENT_DATA });
}