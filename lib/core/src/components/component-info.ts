import { Container } from '../container/container.js';
import { ClassInfo } from '../utils/class-info.js';
import { ClassConstructor } from '../utils/types.js';
import { ComponentFactory } from './component-factory.js';
import { CoreDecorator, DecoratorType } from './enums.js';
import { IComponentDecorator, IGetDecoratorsOptions } from './interfaces.js';
import { IComponentRegistration } from './interfaces.js';
import { ComponentMetadata } from './metadata.js';


/**
 * The `ComponentInfo` class represents information about a component in the dependency injection framework.
 * It provides methods to retrieve decorators, registration details, and other information related to the component.
 * This class is typically used by the framework internally to manage components and their metadata as well as
 * any extension that requires information about the app components.
 * 
 * Note about Generics: 
 * - T: The type of the component instance. 
 * - D: The type of the data passed to the component.
 */
export class ComponentInfo<T = any, D = any> {
  private classConstructor: ClassConstructor<T>;
  private registration: IComponentRegistration<D>;
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

  /**
   * Retrieves the decorators of the component based on the provided options.
   *
   * @param options - Options for retrieving decorators.
   * @returns An array of component decorators.
   */
  getDecorators<D = any>(options: IGetDecoratorsOptions = {}): IComponentDecorator<D>[] {
    let decorators = [...this.decorators];

    if (options.placement && options.placement.length) {
      const placement = options.placement;
      
      decorators = decorators.filter(deco => {
        return placement.includes(this.getDecoratorPlacement(deco));
      });
    }

    if (options.method) {
      decorators = decorators.filter(deco => {
        return deco.method === options.method || deco.method === undefined;
      });
    }

    if (options.id) {
      decorators = decorators.filter(deco => {
        return deco.id === options.id;
      });
    }

    if (options.useId) {
      decorators = decorators.filter(deco => {
        return deco.id === CoreDecorator.USE && ComponentFactory.isComponent(deco.data.component, options.useId);
      });
    }
    
    return decorators;
  }

  /**
   * Retrieves the IDs of the decorators applied to the component.
   *
   * @returns An array of decorator IDs.
   */
  getDecoratorsIds() {
    return this.decorators.map(deco => deco.id);
  }

  /**
   * Retrieves the registration information of the component.
   *
   * @returns The component registration information.
   */
  getRegistration() {
    return this.registration;
  }

  /**
   * Retrieves the class constructor of the component.
   *
   * @returns The class constructor.
   */
  getClass () {
    return this.classConstructor;
  }

  /**
   * Retrieves an instance of the component from the DI container.
   *
   * @returns An instance of the component.
   */
  getInstance() {
    return this.container.get(this.classConstructor) as T;
  }

  /**
   * Retrieves the methods of the component.
   *
   * @returns An array of method names.
   */
  getMethods() {
    return this.methods;
  }

  /**
   * Retrieves the ID of the component.
   *
   * @returns The component ID.
   */
  getId () {
    return this.registration.id;
  }

  /**
   * Retrieves the options passed to the component decorator.
   *
   * @returns The component options.
   */
  getOptions () {
    return this.registration.options || {};
  }

  /**
   * Retrieves the data object passed to the component decorator.
   *
   * @returns The component data.
   */
  getData () {
    return this.registration.data;
  }

  /**
   * Retrieves the dependencies of the component.
   *
   * @returns An array of dependency classes.
   */
  getDependencies () {
    return this.registration.dependencies;
  }

  /**
   * Retrieves the name of the component class.
   *
   * @returns The name of the component class.
   */
  getName () {
    return this.classConstructor.name;
  }

  /**
   * Checks if the component is exported.
   *
   * @returns A boolean indicating if the component is exported.
   */
  isExported () {
    return this.registration.options?.export;
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