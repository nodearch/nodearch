import { ComponentMetadata } from '../component.metadata';
import { ComponentType } from '../enums';
import { injectable, multiInject } from 'inversify';
import { IComponentInfo, IComponentOptions } from "../interfaces";


export function Hook(options?: IComponentOptions): ClassDecorator {
  return function (target: any) {
    ComponentMetadata.setInfo<IComponentInfo>(target, {
      scope: options?.scope,
      type: ComponentType.Hook,
      namespace: options?.namespace
    });
    injectable()(target);
  }
}
