import { Container } from 'inversify';
import { IComponentOverride } from './test.interfaces';


export class TestBox {
  constructor(private container: Container) {}

  mock(override: IComponentOverride): void;
  mock(overrides: IComponentOverride[]): void;
  mock(overrides: IComponentOverride | IComponentOverride[]): void {
    this.clearCache();

    overrides = Array.isArray(overrides) ? overrides : [overrides];

    overrides.forEach(override => {
      this.container.rebind(override.component).toConstantValue(override.use);
    });
  }

  snapshot() {
    this.container.snapshot();
  }

  restore() {
    this.container.restore();
  }

  private clearCache() {
    const compsMap = (<Map<any, any[]>>(<any>this.container)._bindingDictionary._map);
    
    compsMap.forEach(comps => {
      comps.forEach(comp => {
        if (comp.type === 'Instance') {
          comp.cache = null;
          comp.activated = false;
        }
      });
    });
  }
}
