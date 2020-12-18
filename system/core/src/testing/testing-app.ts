import { App } from "../app";
import { AppStage, ComponentType } from "../components";
import { IComponentOverride } from "./testing.interfaces";
import { ClassConstructor } from "../utils";

export class TestingApp extends App {

  mock(override: IComponentOverride): TestingApp;
  mock(overrides: IComponentOverride[]): TestingApp;
  mock(overrides: IComponentOverride | IComponentOverride[]): TestingApp {
    this.clearCache();
    
    overrides = Array.isArray(overrides) ? overrides : [overrides];

    overrides.forEach(override => {
      this.components.override(override.component, override.use);
    });

    return this;
  }
  
  snapshot(): TestingApp {
    this.components.snapshot();
    return this;
  }

  restore(): TestingApp {
    this.components.restore();
    this.clearCache();
    return this;
  }

  get<T>(classIdentifier: ClassConstructor): T {
    return this.components.get<T>(classIdentifier);
  }

  getAll<T>(identifier: ComponentType | string | symbol): T[] {
    return this.components.getAll<T>(identifier);
  }

  clearCache() {
    this.components.clearCache();
    return this;
  }

  async run(stage: AppStage = AppStage.Start) {
    if (this.isRunCalled) {
      throw new Error('app.run is already called, you can\'t call it twice!');
    }
    else {
      this.isRunCalled = true;
    }

    switch (stage) {
      case AppStage.Load:
        await this.load();
        break;
      case AppStage.Init:
        await this.load();
        await this.init();
        break;
      case AppStage.Start:
        await this.load();
        await this.init();
        await this.start();
        break;
    }
  }
}
