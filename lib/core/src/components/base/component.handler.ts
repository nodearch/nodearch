import { IComponentHandler, IComponentInfo } from "../../interfaces";
import { BaseComponentHandler } from '../../base-handler';
import { Container } from 'inversify';
import { ClassConstructor } from '../../../utils';

export class ComponentHandler extends BaseComponentHandler implements IComponentHandler {
  constructor(container: Container) {
    super(container);
  }

  register(classDef: ClassConstructor, componentInfo: IComponentInfo) {
    this.bindComponent({
      component: classDef,
      ...componentInfo
    });
  }

  registerExtension(classDef: ClassConstructor, componentInfo: IComponentInfo, extContainer: Container) {
    this.bindExtComponent({
      component: classDef,
      ...componentInfo,
      extContainer
    });
  }

}