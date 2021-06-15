import { App, RunMode } from "../app";
import { ComponentType } from "../component";
import { IComponentOverride } from "./testing.interfaces";
import { ClassConstructor } from "../utils";


export abstract class TestingApp {
  // TODO: provide options to override extensions, components, etc.
  static async create(appPath: string): Promise<App> {
    const importedApp = await import(appPath);
    const app: App = new importedApp.default();

    // TODO: cache the app up to here, so we don't load again, and maybe provide a custom copy instead.

    await app.run({ mode: RunMode.TEST });

    return app;
  }
}

// export class TestingApp extends App {

//   mock(override: IComponentOverride): TestingApp;
//   mock(overrides: IComponentOverride[]): TestingApp;
//   mock(overrides: IComponentOverride | IComponentOverride[]): TestingApp {
//     this.clearCache();
    
//     overrides = Array.isArray(overrides) ? overrides : [overrides];

//     overrides.forEach(override => {
//       this.componentManager.override(override.component, override.use);
//     });

//     return this;
//   }
  
//   snapshot(): TestingApp {
//     this.componentManager.snapshot();
//     return this;
//   }

//   restore(): TestingApp {
//     this.componentManager.restore();
//     this.clearCache();
//     return this;
//   }

//   get<T>(classIdentifier: ClassConstructor): T {
//     return this.componentManager.get<T>(classIdentifier);
//   }

//   getAll<T>(identifier: ComponentType | string | symbol): T[] {
//     return this.componentManager.getAll<T>(identifier);
//   }

//   clearCache() {
//     this.componentManager.clearCache();
//     return this;
//   }
// }
