import { MetadataInfo } from '@nodearch/core';
import { IEventHandlerParamsMetadata, IEventSubscribeMetadata, INamespaceControllerMetadata, INamespaceMetadata, IControllerNamespaceMetadata } from './interfaces';


export abstract class MetadataManager {
  static readonly PREFIX = 'socket.io/controller';
  static readonly SUBSCRIBE = MetadataManager.PREFIX + '-subscribe';
  static readonly EVENT_HANDLER_PARAMS = MetadataManager.PREFIX + '-eventHandlerParams';
  static readonly EVENT_DATA = MetadataManager.PREFIX + '-eventData';
  static readonly CONTROLLER_NAMESPACES = MetadataManager.PREFIX + '-controllerNamespaces';
  static readonly NAMESPACE_INFO = MetadataManager.PREFIX + '-namespaceInfo';
  static readonly NAMESPACE_CONTROLLERS = MetadataManager.PREFIX + '-namespaceControllers';

  static getSubscribes(controller: Function): IEventSubscribeMetadata[] {
    return MetadataInfo.getClassMetadata(MetadataManager.SUBSCRIBE, controller) || [];
  }

  static setSubscribe(controller: Function, subscribe: IEventSubscribeMetadata): void {
    const subscribes = MetadataManager.getSubscribes(controller);
    subscribes.push(subscribe);

    MetadataInfo.setClassMetadata(MetadataManager.SUBSCRIBE, controller, subscribes);
  }

  static getEventHandlerParams(controller: Object, methodName: string): IEventHandlerParamsMetadata[] {
    return MetadataInfo.getMethodMetadata(MetadataManager.EVENT_HANDLER_PARAMS, controller, methodName) || [];
  }

  static setEventHandlerParams(controller: Object, methodName: string, paramInfo: IEventHandlerParamsMetadata) {
    const params = MetadataManager.getEventHandlerParams(controller, methodName);
    params.push(paramInfo);

    MetadataInfo.setMethodMetadata(MetadataManager.EVENT_HANDLER_PARAMS, controller, methodName, params);
  }

  static getControllerNamespaces(controller: Function): IControllerNamespaceMetadata[] {
    return MetadataInfo.getClassMetadata(MetadataManager.CONTROLLER_NAMESPACES, controller) || [];
  }

  static setControllerNamespace(controller: Function, namespaceMetadata: IControllerNamespaceMetadata) {
    const namespaces = MetadataManager.getControllerNamespaces(controller);
    namespaces.push(namespaceMetadata);

    MetadataInfo.setClassMetadata(MetadataManager.CONTROLLER_NAMESPACES, controller, namespaces);
  }

  static getNamespace(namespaceClass: Function): INamespaceMetadata | undefined {
    return MetadataInfo.getClassMetadata(MetadataManager.NAMESPACE_INFO, namespaceClass);
  }

  static setNamespace(namespaceClass: Function, info: INamespaceMetadata) {
    MetadataInfo.setClassMetadata(MetadataManager.NAMESPACE_INFO, namespaceClass, info);
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
