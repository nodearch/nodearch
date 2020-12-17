import { ComponentMetadata } from '../component.metadata';
import { ComponentType } from '../enums';
import { injectable } from 'inversify';
import { IComponentInfo, IComponentOptions } from "../interfaces";


export function Config(options?: IComponentOptions): ClassDecorator {
  return function (target: any) {
    ComponentMetadata.setInfo<IComponentInfo>(target, {
      scope: options?.scope,
      type: ComponentType.Config,
      id: options?.id
    });
    injectable()(target);
  }
}