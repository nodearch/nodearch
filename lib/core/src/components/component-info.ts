import { Container } from '../app/container.js';
import { ClassInfo } from '../utils/class-info.js';
import { ClassConstructor } from '../utils/types.js';
import { ComponentBinder } from './component-binding.js';
import { isComponent } from './decorator-factory.js';
import { CoreDecorator, DecoratorType } from './enums.js';
import { IComponentDecorator, IGetDecoratorsOptions } from './interfaces.js';
import { IComponentRegistration } from './interfaces.js';
import { ComponentMetadata } from './metadata.js';


// Do binding here for the component and remove component handler
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
    ComponentBinder.bindComponent({
      container,
      componentClass: classConstructor,
      id: registration.id,
      namespace: registration.options?.namespace,
      scope: registration.options?.scope
    });
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

  getDecorators<T = any>(options: IGetDecoratorsOptions = {}): IComponentDecorator<T>[] {
    let decorators = [...this.decorators];

    if (options.placement && options.placement.length) {
      const placement = options.placement;
      
      decorators = decorators.filter(deco => {
        return placement.includes(this.getDecoratorPlacement(deco));
      });
    }

    if (options.method) {
      decorators = decorators.filter(deco => {
        return deco.type !== DecoratorType.CLASS && deco.method === options.method;
      });
    }

    if (options.id) {
      decorators = decorators.filter(deco => {
        return deco.id === options.id;
      });
    }

    if (options.useId) {
      decorators = decorators.filter(deco => {
        return deco.id === CoreDecorator.USE && isComponent(deco.data.component, options.useId);
      });
    }
    
    return decorators;
  }

  getDecoratorsIds() {
    const decorators = this.decorators.map(deco => deco.id);
    decorators.push(this.registration.id);
    return decorators;
  }

  getRegistration() {
    return this.registration;
  }

  get isExported () {
    return this.registration.options?.export;
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

  get isHook () {
    return this.registration.id === CoreDecorator.HOOK;
  }

  get isController () {
    return this.registration.id === CoreDecorator.CONTROLLER;
  }

  get isService () {
    return this.registration.id === CoreDecorator.SERVICE;
  }

  get isRepository () {
    return this.registration.id === CoreDecorator.REPOSITORY;
  }

  get name () {
    return this.classConstructor.name;
  }

  private getDecoratorPlacement(deco: IComponentDecorator) {
    if (deco.type === DecoratorType.CLASS_METHOD) {
      return deco.method ? DecoratorType.METHOD : DecoratorType.CLASS;
    }
    else {
      return deco.type;
    }
  }
}