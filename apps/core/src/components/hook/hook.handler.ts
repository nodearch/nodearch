import { Container } from 'inversify';
import {ComponentType} from '../enums';
import { ClassConstructor } from '../../utils';
import {IComponentHandler, IComponentInfo} from '../interfaces';
import {BaseComponentHandler} from "../base-handler";

export class HookHandler extends BaseComponentHandler implements IComponentHandler {
  constructor(container: Container) {
    super(container);
  }

  register(classDef: ClassConstructor, componentInfo: IComponentInfo) {
    this.bindComponent({
      component: classDef,
      componentInfo,
      type: ComponentType.Hook
    });
  }

  registerExtension(classDef: ClassConstructor, extContainer: Container) {
    this.bindExtComponent({
      component: classDef,
      extContainer,
      type: ComponentType.Hook
    });
  }
}