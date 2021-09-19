import { ClassConstructor, ClassInfo, ClassMethodDecorator, Component } from '@nodearch/core';
import { HandlerParamType } from './enums';
import { MetadataManager } from './metadata';


export function Subscribe(eventName: string): MethodDecorator {
  return function (target: Object, propKey: string | symbol) {
    const params = MetadataManager.getHandlerParams(target, <string>propKey);

    MetadataManager.setSubscribe(target.constructor, {
      method: propKey as string,
      eventName,
      params
    });
  };
}

export function UseNamespace(namespace: ClassConstructor): ClassMethodDecorator {
  return function (target: Function | Object, propKey?: string) {
    const controllerConstructor = (propKey ? target.constructor : target) as ClassConstructor;

    const nsName = MetadataManager.getNamespaceName(namespace);

    if (!nsName) 
      throw new Error(`[Socket.IO] Component ${namespace.name} is not a valid Namespace, check that you're using the @Namespace decorator!`);

    const namespacesLength = MetadataManager.getNamespaceControllers(namespace).length;
    
    const ctrlId = 'socket.io-namespaceController:' + namespacesLength;
    
    ClassInfo.propertyInject(namespace, controllerConstructor, ctrlId);

    // Add The controller as dependency to the namespace and put the reference in the namespace's metadata
    MetadataManager.setNamespaceController(namespace, { classRef: controllerConstructor, instanceKey: ctrlId });

    // Add the namespace to the controller, because this will be our entry point to find namespaces
    MetadataManager.setControllerNamespace(controllerConstructor, {
      name: nsName,
      classRef: namespace,
      method: propKey as string,
    });
  };
}

export function Namespace(name: string): ClassDecorator {
  return (target: Function) => {
    MetadataManager.setNamespaceName(target, name);
    Component()(target);
  };
}

export function SocketInfo() {
  return (target: Object, propKey: string | symbol, paramIndex: number) => {
    MetadataManager.setHandlerParams(target, <string>propKey, { 
      type: HandlerParamType.SOCKET_INFO, 
      index: paramIndex 
    });
  };
}

export function EventData() {
  return (target: Object, propKey: string | symbol, paramIndex: number) => {
    MetadataManager.setHandlerParams(target, <string>propKey, { 
      type: HandlerParamType.EVENT_DATA, 
      index: paramIndex 
    });
  };
}
