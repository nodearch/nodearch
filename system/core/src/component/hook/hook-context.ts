import { ComponentManager } from '../component-manager';
import { ClassConstructor } from '../../utils';
import { ComponentType } from '../enums';
import { IHook } from './hook.interface';
import { ICli } from '../cli';
import { DependencyException } from '../../errors';

export class HookContext {
  constructor(private componentManager: ComponentManager) {}

  get<T>(classIdentifier: ClassConstructor): T {
    try {
      return this.componentManager.get<T>(classIdentifier);
    }
    catch(e) {
      throw new DependencyException(e.message);
    }
  }

  getAll<T>(identifier: ComponentType | string | symbol): T[] {
    try {
      return this.componentManager.getAll<T>(identifier);
    }
    catch(e) {
      throw new DependencyException(e.message);
    }
  }

  findHooks(): IHook[] | undefined {
    return this.componentManager.findHooks();
  }

  findCLICommands(): ICli[] | undefined {
    return this.componentManager.findCLICommands();
  }

  getComponents(componentType: ComponentType) {
    return this.componentManager.getComponents(componentType);
  }
}