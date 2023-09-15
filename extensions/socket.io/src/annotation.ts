import { ComponentFactory } from '@nodearch/core/components';
import { SocketIODecorator } from './enums.js';
import { NamespaceName } from './interfaces.js';


export function Subscribe(eventName: string): MethodDecorator {
  return ComponentFactory.methodDecorator({ id: SocketIODecorator.SUBSCRIBE, fn: () => ({ eventName }) });
}

export function Namespace(name: NamespaceName): ClassDecorator {
  return ComponentFactory.classDecorator({ id: SocketIODecorator.NAMESPACE, fn: () => ({ name }) });
}

export function SocketInfo() {
  return ComponentFactory.parameterDecorator({ id: SocketIODecorator.SOCKET_INFO });
}

export function EventData() {
  return ComponentFactory.parameterDecorator({ id: SocketIODecorator.EVENT_DATA });
}
