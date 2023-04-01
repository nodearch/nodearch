import { Container } from '../app/container.js';
import { ClassInfo } from '../utils/class-info.js';
import { ClassConstructor } from '../utils/types.js';
import { IUseDecoratorOptions } from './component/interfaces.js';
import { isComponent } from './decorator-factory.js';
import { CoreDecorator } from './enums.js';
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

  getDecorators<T = any>(options?: { id?: string; method?: string; useId?: string; }): IComponentDecorator<T>[] {
    if (!options) return this.decorators;

    let decorators = [...this.decorators];

    if (options.method) {
      decorators = decorators.filter(deco => {
        return deco.method === options.method;
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

  // getDecoratorsByMethod<T = any>(method: string): IComponentDecorator<T>[] {
  //   return this.getDecorators<T>({ method });
  // }

  // getDecoratorsById<T = any>(id: string): IComponentDecorator<T>[] {
  //   return this.getDecorators<T>({ id });
  // }

  // /**
  //  * Get a list of decorators info of type @Use()
  //  * @param id id of the component passed to @Use()
  //  */
  // getUseDecorators<T>(id: string) {
  //   return this.getDecorators<IUseDecoratorOptions<T>>({ useId: id });
  // }

  getRegistration() {
    return this.registration;
  }

  getDecoratorsIds() {
    const decorators = this.decorators.map(deco => deco.id);
    decorators.push(this.registration.id);
    return decorators;
  }

  get isExported () {
    return this.registration.options?.export;
  }

  get isHook () {
    return this.registration.id === CoreDecorator.HOOK;
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