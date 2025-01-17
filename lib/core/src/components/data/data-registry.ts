import { ClassConstructor } from '../../utils.index.js';
import { ComponentInfo } from '../component-info.js';
import { DataComponentInfo } from './data-component.info.js';


export class DataRegistry {
  private componentsMap: DataComponentInfo[];

  constructor() {
    this.componentsMap = [];
  }

  getDataComponent(classConstructor: ClassConstructor) {
    return this.componentsMap.find(comp => comp.componentInfo.getClass() === classConstructor);
  }

  // This is called first to initialize the data components from the component registry
  registerDataComponents(dataComponents: ComponentInfo[]) {
    dataComponents.forEach(comp => {
      this.componentsMap.push(
        new DataComponentInfo(comp, dataComponents)
      );
    });
  }

}