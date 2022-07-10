import { ComponentManager } from '../component-manager';
import { ClassConstructor } from '../../utils';
import { ComponentType } from '../enums';
import { IHook } from './hook.interface';
import { ICli } from '../cli';
import { DependencyException } from '../../errors';
import inversify from 'inversify';

export class HookContext {
  constructor(private components: ComponentManager) {}

  get<T>(classIdentifier: ClassConstructor): T {
    try {
      return this.components.get<T>(classIdentifier);
    }
    catch(e: any) {
      throw new DependencyException(e.message);
    }
  }

  getAll<T>(identifier: ComponentType | string | symbol): T[] {
    try {
      return this.components.getAll<T>(identifier);
    }
    catch(e: any) {
      throw new DependencyException(e.message);
    }
  }

  findHooks(): IHook[] | undefined {
    return this.components.findHooks();
  }

  findCLICommands(): ICli[] | undefined {
    return this.components.findCLICommands();
  }

  getComponents(componentType: ComponentType) {
    return this.components.getComponents(componentType);
  }

  getContainer(): inversify.Container {
    return this.components.getContainer();
  }
}