import { ComponentMetadata } from '../component.metadata';
import { ComponentType } from '../enums';
import { injectable } from 'inversify';
import { IComponentInfo, IComponentOptions } from "../interfaces";


export function Controller(options?: IComponentOptions): ClassDecorator {
  return function (target: any) {
    ComponentMetadata.setInfo<IComponentInfo>(target, {
      scope: options?.scope,
      type: ComponentType.Controller,
      id: options?.id
    }); // TODO: should me make controllers optional in inversify
    injectable()(target);
  }
}