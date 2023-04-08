import inversify from 'inversify';
import { ComponentScope } from '../components/enums.js';
import { ClassConstructor } from '../utils.index.js';


export class ContainerBinder {
  
  private inversifyContainer: inversify.Container;


  constructor(inversifyContainer: inversify.Container) {
    this.inversifyContainer = inversifyContainer;
  }

  bindComponent(componentClass: ClassConstructor, scope?: ComponentScope) {
    let binding: inversify.interfaces.BindingWhenOnSyntax<any>;

    if (scope === ComponentScope.SINGLETON) {
      binding = this.inversifyContainer.bind(componentClass).toSelf().inSingletonScope();
    }
    else if (scope === ComponentScope.TRANSIENT) {
      binding = this.inversifyContainer.bind(componentClass).toSelf().inTransientScope();
    }
    else if (scope === ComponentScope.REQUEST) {
      binding = this.inversifyContainer.bind(componentClass).toSelf().inRequestScope();
    }
    else {
      binding = this.inversifyContainer.bind(componentClass).toSelf();
    }

    return binding;
  }

  bindNamespace(container: inversify.Container, namespace: string) {
    
  }
}