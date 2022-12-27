import { Container } from 'inversify';
import { ComponentRegistry } from '../components';
import { DependencyException } from '../errors';
import { ClassConstructor } from '../utils';
import { IAppInfo } from './app.interfaces';


export class AppContext {
  constructor(
    private components: ComponentRegistry,
    private container: Container,
    public appInfo: IAppInfo
  ) {}

  get<T>(classIdentifier: ClassConstructor): T | undefined {
    try {
      return this.container.get<T>(classIdentifier);
    }
    catch(e: any) {
      if (e.message !== `No matching bindings found for serviceIdentifier: ${classIdentifier}`) {
        throw new DependencyException(e.message);
      }
    }
  }

  getAll<T>(id: string): T[] {
    let instances: T[] = [];
    
    try {
      instances = this.container.getAll<T>(id);
    }
    catch(e: any) {
      if (e.message !== `No matching bindings found for serviceIdentifier: ${id}`) {
        throw new DependencyException(e.message);
      }
    }

    return instances;
  }

  getComponents(id: string) {
    return this.components.getComponents(id);
  }

  getContainer(): Container {
    return this.container;
  }
}