import { Container } from '../app/container.js';
import { ClassInfo } from '../utils/class-info.js';
import { ClassConstructor } from '../utils/types.js';
import { CoreAnnotation } from './enums.js';
import { IComponentDecorator } from './interfaces.js';
import { IComponentRegistration } from './interfaces.js';
import { ComponentMetadata } from './metadata.js';


export class ComponentInfo<T = any> {
  private classConstructor: ClassConstructor;
  private registration: IComponentRegistration<T>;
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

  getDecorators<T = any>(): IComponentDecorator<T>[] {
    return this.decorators;
  }

  getDecoratorsByMethod<T = any>(method: string): IComponentDecorator<T>[] {
    return this.decorators.filter(deco => {
      return deco.method === method;
    });
  }

  getDecoratorsById<T = any>(id: string): IComponentDecorator<T>[] {
    return this.decorators.filter(deco => {
      return deco.id === id;
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

  get dependencies () {
    return this.registration.dependencies;
  }
}