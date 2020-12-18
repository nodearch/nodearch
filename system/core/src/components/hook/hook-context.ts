import { ComponentManagement } from '../components';
import { ClassConstructor } from '../../utils';
import { ComponentType } from '../enums';
import { IHook } from './hook.interface';
import { ICLI } from '../cli';

export class HookContext {
  constructor(private components: ComponentManagement) {}

  get<T>(classIdentifier: ClassConstructor): T {
    return this.components.get<T>(classIdentifier);
  }

  getAll<T>(identifier: ComponentType | string | symbol): T[] {
    return this.components.getAll<T>(identifier);
  }

  findHooks(): IHook[] | undefined {
    return this.components.findHooks();
  }

  findCLICommands(): ICLI[] | undefined {
    return this.components.findCLICommands();
  }
}