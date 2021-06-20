import { Container } from 'inversify';
import { ClassConstructor } from '../../utils';
import {IComponentHandler, IComponentInfo} from '../interfaces';
import {BaseComponentHandler} from "../base-handler";
import { ComponentType } from '../enums';

export class TestHandler extends BaseComponentHandler implements IComponentHandler {
  constructor(container: Container) {
    super(container);
  }

  register(classDef: ClassConstructor, componentInfo: IComponentInfo) {
    this.bindComponent({
      component: classDef,
      componentInfo,
      type: ComponentType.Test
    });
  }
}