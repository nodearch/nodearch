import { ComponentInfo } from '../component-info.js';
import { CoreDecorator } from '../enums.js';
import { DataFieldInfo } from './data-field.info.js';


export class DataComponentInfo {
  componentInfo: ComponentInfo;
  fields: DataFieldInfo[];

  constructor(comp: ComponentInfo, dataComponents: ComponentInfo[]) {
    this.componentInfo = comp;
    this.fields = [];

    const fieldsDecorators = comp.getDecorators({ id: CoreDecorator.FIELD });

    for (const fieldDecorator of fieldsDecorators) {

      this.fields.push(
        new DataFieldInfo(fieldDecorator, comp, dataComponents)
      );

    }
  }
}
