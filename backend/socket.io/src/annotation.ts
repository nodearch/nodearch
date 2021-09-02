import { ClassMethodDecorator } from '@nodearch/core';
import { ControllerMetadata } from './metadata';


export function Subscribe(eventName: string): MethodDecorator {
  return function (target: Object, propKey: string | symbol) {
    ControllerMetadata.setSubscribe(target.constructor, {
      method: propKey as string,
      eventName
    });
  };
}

export function Use(): ClassMethodDecorator {
  return function (target: Object, propKey?: string) {};
}

export function Namespace(name: string): ClassMethodDecorator {
  return function (target: Object, propKey?: string) {};
}