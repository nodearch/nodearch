import { Container } from 'inversify';
import { ClassConstructor } from '../../utils'
import { IComponentOverride } from './test.interfaces';


export class TestBox {
  constructor(private container: Container) {}

  get<T>(id: ClassConstructor) {
    return this.container.get<T>(id);
  }

  mock(override: IComponentOverride): TestBox;
  mock(overrides: IComponentOverride[]): TestBox;
  mock(overrides: IComponentOverride | IComponentOverride[]): TestBox {
    this.clearCache();

    overrides = Array.isArray(overrides) ? overrides : [overrides];

    overrides.forEach(override => {
      this.container.rebind(override.component).toConstantValue(override.use);
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
