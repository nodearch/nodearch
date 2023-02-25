import { Container } from '@nodearch/core';
import { ClassConstructor } from '@nodearch/core/utils';
import { IComponentOverride } from './annotation/test.interfaces.js';


export class TestBox {
  constructor(private container: Container) {}

  get<T>(id: ClassConstructor) {
    return this.container.get<T>(id);
  }

  mock(override: IComponentOverride): TestBox;
  mock(overrides: IComponentOverride[]): TestBox;
  mock(overrides: IComponentOverride | IComponentOverride[]): TestBox {
    this.container.clearCache();

    overrides = Array.isArray(overrides) ? overrides : [overrides];

    overrides.forEach(override => {
      this.container.override(override.component, override.use);
    });
    return this;
  }

  snapshot() {
    this.container.snapshot();
    return this;
  }

  restore() {
    this.container.restore();
    return this;
  }
}