import { ClassConstructor, ClassInfo } from '../../utils';
import { ComponentMetadata } from './metadata';
import { IComponentRegistration } from './interfaces';
import { IComponentDecorator } from '../interfaces';
import { Container } from 'inversify';
import { CoreAnnotation } from '../enums';


export class ComponentInfo {
  private classConstructor: ClassConstructor;
  private registration: IComponentRegistration;
  private decorators: IComponentDecorator[];
  private container: Container;
  private methods: string[];


  constructor(classConstructor: ClassConstructor, registration: IComponentRegistration, container: Container) {
    this.classConstructor = classConstructor;
    this.registration = registration;
    this.decorators = ComponentMetadata.getComponentDecorators(classConstructor);
    this.container = container;
    this.methods = ClassInfo.getMethods(classConstructor);
  }

  getClass() {
    return this.classConstructor;
  }

  getInstance() {
    return this.container.get(this.classConstructor);
  }

  getMethods() {
    return this.methods;
  }

  getDecorators() {
    return this.decorators;
  }

  getDecoratorsByMethod(method: string) {
    return this.decorators.filter(deco => {
      return deco.global || deco.method === method;
    });
  }

  getRegistration() {
    return this.registration;
  }

  get isExported () {
    return this.registration.options?.export;
  }

  get isHook () {
    return this.registration.id === CoreAnnotation.Hook;
  }

  get id () {
    return this.registration.id;
  }

  get options () {
    return this.registration.options;
  }

  get data () {
    return this.registration.data;
  }
}