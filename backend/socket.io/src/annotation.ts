import { ClassConstructor, ClassInfo, ClassMethodDecorator, Component } from '@nodearch/core';
import { EventHandlerParamType } from './enums';
import { MetadataManager } from './metadata';


export function Subscribe(eventName: string): MethodDecorator {
  return function (target: Object, propKey: string | symbol) {
    const params = MetadataManager.getEventHandlerParams(target, <string>propKey);

    MetadataManager.setSubscribe(target.constructor, {
      method: propKey as string,
      eventName,
      params
    });
  };
}

export function UseNamespace(namespace: ClassConstructor): ClassMethodDecorator {
  return function (target: Function | Object, propKey?: string) {
    const targetConstructor = (propKey ? target.constructor : target) as ClassConstructor;

    const nsInfo = MetadataManager.getNamespaceInfo(namespace);

    if (!nsInfo) 
      throw new Error(`[Socket.IO] Component ${namespace.name} is not a valid Namespace, check that you're using the @Namespace decorator!`);

    const namespacesLength = MetadataManager.getNamespaces(targetConstructor).length;
    const namespaceId = 'socket.io-namespace:' + namespacesLength;
    ClassInfo.propertyInject(targetConstructor, namespace, namespaceId);

    MetadataManager.setNamespace(targetConstructor, {
      name : nsInfo.name,
      classRef: namespace,
      instanceKey: namespaceId,
      method: propKey as string,
    });
  };
}

export function Namespace(name: string): ClassDecorator {
  return function (target: Function) {
    Component()(target);
  };
}

export function SocketInfo() {
  return (target: Object, propKey: string | symbol, paramIndex: number) => {
    MetadataManager.setEventHandlerParams(target, <string>propKey, { 
      type: EventHandlerParamType.SOCKET_INFO, 
      index: paramIndex 
    });
  };
}

export function EventData() {
  return (target: Object, propKey: string | symbol, paramIndex: number) => {
    MetadataManager.setEventHandlerParams(target, <string>propKey, { 
      type: EventHandlerParamType.EVENT_DATA, 
      index: paramIndex 
    });
  };
}
