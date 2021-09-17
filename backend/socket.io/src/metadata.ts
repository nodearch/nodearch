import { MetadataInfo } from '@nodearch/core';
import { IEventHandlerParamsMetadata, IEventSubscribeMetadata, INamespaceInfoMetadata, INamespaceMetadata } from './interfaces';


export abstract class MetadataManager {
  static readonly PREFIX = 'socket.io/controller';
  static readonly SUBSCRIBE = MetadataManager.PREFIX + '-subscribe';
  static readonly EVENT_HANDLER_PARAMS = MetadataManager.PREFIX + '-eventHandlerParams';
  static readonly EVENT_DATA = MetadataManager.PREFIX + '-eventData';
  static readonly NAMESPACES = MetadataManager.PREFIX + '-namespaces';
  static readonly NAMESPACE_INFO = MetadataManager.PREFIX + '-namespaceInfo';

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

  static getNamespaces(controller: Function): INamespaceMetadata[] {
    return MetadataInfo.getClassMetadata(MetadataManager.NAMESPACES, controller) || [];
  }

  static setNamespace(controller: Function, namespaceMetadata: INamespaceMetadata) {
    const namespaces = MetadataManager.getNamespaces(controller);
    namespaces.push(namespaceMetadata);

    MetadataInfo.setClassMetadata(MetadataManager.NAMESPACES, controller, namespaces);
  }

  static getNamespaceInfo(namespaceClass: Function): INamespaceInfoMetadata | undefined {
    return MetadataInfo.getClassMetadata(MetadataManager.NAMESPACE_INFO, namespaceClass);
  }

  static setNamespaceInfo(namespaceClass: Function, info: INamespaceInfoMetadata) {
    MetadataInfo.setClassMetadata(MetadataManager.NAMESPACE_INFO, namespaceClass, info);
  }
}
