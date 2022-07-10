import { injectable } from 'inversify';
import { ClassConstructor } from '../utils';
import { ComponentMetadata } from './component.metadata';
import { IComponentHandler, IComponentInfo, IComponentOptions } from './interfaces';

export abstract class ComponentFactory {
  
  static decorator(id: string): ClassDecorator;
  static decorator(id: string, options?: IComponentOptions): ClassDecorator;
  static decorator(id: string, handler?: ClassConstructor<IComponentHandler>): ClassDecorator;
  static decorator(id: string, handler?: ClassConstructor<IComponentHandler>, options?: IComponentOptions): ClassDecorator;
  
  static decorator(...args: any[]): ClassDecorator {
    
    let compInfo: IComponentInfo = {
      id: args[0]
    };

    if (args.length === 2) {
      if (typeof args[1] === 'function') {
        compInfo.handler = args[1];
      }
      else {
        compInfo = {
          ...compInfo,
          ...args[1]
        };
      }
    }
    else if (args.length === 3) {
      compInfo = {
        ...compInfo,
        ...args[2]
      };
    }

    return function (target: any) {
      ComponentMetadata.setInfo<IComponentInfo>(target, compInfo);
      injectable()(target);
    }
  }
}