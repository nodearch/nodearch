import { ComponentRegistry } from '../../registration';

// TODO: introduce new features in v2?
export class HookContext {
  constructor(private components: ComponentRegistry) {}

  // get<T>(classIdentifier: ClassConstructor): T {
  //   try {
  //     return this.components.get<T>(classIdentifier);
  //   }
  //   catch(e: any) {
  //     throw new DependencyException(e.message);
  //   }
  // }

  // getAll<T>(id: string | symbol): T[] {
  //   try {
  //     return this.components.getAll<T>(id);
  //   }
  //   catch(e: any) {
  //     throw new DependencyException(e.message);
  //   }
  // }

  // findHooks(): IHook[] | undefined {
  //   return this.components.findHooks();
  // }

  // findCLICommands(): ICli[] | undefined {
  //   return this.components.findCLICommands();
  // }

  getComponents(id: string) {
    return this.components.getComponents(id);
  }

  // getContainer(): inversify.Container {
  //   return this.components.getContainer();
  // }
}