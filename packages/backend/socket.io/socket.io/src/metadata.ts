import { MetadataInfo } from '@nodearch/core';
import { IEventSubscribeMetadata, INamespaceControllerMetadata, IControllerNamespaceMetadata, IHandlerParamsMetadata, NamespaceName } from './interfaces';


export abstract class MetadataManager {
  static readonly PREFIX = 'socket.io/controller';
  static readonly SUBSCRIBE = MetadataManager.PREFIX + '-subscribe';
  static readonly HANDLER_PARAMS = MetadataManager.PREFIX + '-handlerParams';
  static readonly EVENT_DATA = MetadataManager.PREFIX + '-eventData';
  static readonly CONTROLLER_NAMESPACES = MetadataManager.PREFIX + '-controllerNamespaces';
  static readonly NAMESPACE_NAME = MetadataManager.PREFIX + '-namespaceName';
  static readonly NAMESPACE_CONTROLLERS = MetadataManager.PREFIX + '-namespaceControllers';

  static getSubscribes(controller: Function): IEventSubscribeMetadata[] {
    return MetadataInfo.getClassMetadata(MetadataManager.SUBSCRIBE, controller) || [];
  }

  static setSubscribe(controller: Function, subscribe: IEventSubscribeMetadata): void {
    const subscribes = MetadataManager.getSubscribes(controller);
    subscribes.push(subscribe);

    MetadataInfo.setClassMetadata(MetadataManager.SUBSCRIBE, controller, subscribes);
  }

  static getHandlerParams(classConstructor: Object, methodName: string): IHandlerParamsMetadata[] {
    return MetadataInfo.getMethodMetadata(MetadataManager.HANDLER_PARAMS, classConstructor, methodName) || [];
  }

  static setHandlerParams(classConstructor: Object, methodName: string, paramInfo: IHandlerParamsMetadata) {
    const params = MetadataManager.getHandlerParams(classConstructor, methodName);
    params.push(paramInfo);

    MetadataInfo.setMethodMetadata(MetadataManager.HANDLER_PARAMS, classConstructor, methodName, params);
  }

  static getControllerNamespaces(controller: Function): IControllerNamespaceMetadata[] {
    return MetadataInfo.getClassMetadata(MetadataManager.CONTROLLER_NAMESPACES, controller) || [];
  }

  static setControllerNamespace(controller: Function, namespaceMetadata: IControllerNamespaceMetadata) {
    const namespaces = MetadataManager.getControllerNamespaces(controller);
    namespaces.push(namespaceMetadata);

    MetadataInfo.setClassMetadata(MetadataManager.CONTROLLER_NAMESPACES, controller, namespaces);
  }

  static getNamespaceName(namespaceClass: Function): NamespaceName | undefined {
    return MetadataInfo.getClassMetadata(MetadataManager.NAMESPACE_NAME, namespaceClass);
  }

  static setNamespaceName(namespaceClass: Function, name: NamespaceName) {
    MetadataInfo.setClassMetadata(MetadataManager.NAMESPACE_NAME, namespaceClass, name);
  }

  static getNamespaceControllers(namespaceClass: Function): INamespaceControllerMetadata[] {
    return MetadataInfo.getClassMetadata(MetadataManager.NAMESPACE_CONTROLLERS, namespaceClass) || [];
  }

  static setNamespaceController(namespaceClass: Function, controller: INamespaceControllerMetadata) {
    const nsControllers = MetadataManager.getNamespaceControllers(namespaceClass);
    if (!nsControllers.find(x => x.classRef === controller.classRef)) {
      nsControllers.push(controller);
      MetadataInfo.setClassMetadata(MetadataManager.NAMESPACE_CONTROLLERS, namespaceClass, nsControllers);
    }
  }
}
