import { MetadataInfo } from '@nodearch/core';
import { IEventSubscribeMetadata } from './interfaces';


export abstract class ControllerMetadata {
  static readonly PREFIX = 'socket.io/controller';
  static readonly SUBSCRIBE = ControllerMetadata.PREFIX + '-subscribe';

  static getSubscribes(controller: any): IEventSubscribeMetadata[] {
    return MetadataInfo.getClassMetadata(ControllerMetadata.SUBSCRIBE, controller) || [];
  }

  static setSubscribe(controller: any, subscribe: IEventSubscribeMetadata): void {
    const subscribes = ControllerMetadata.getSubscribes(controller);
    subscribes.push(subscribe);

    MetadataInfo.setClassMetadata(ControllerMetadata.SUBSCRIBE, controller, subscribes);
  }
}
