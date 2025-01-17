import { ComponentInfo } from '../component-info.js';
import { CoreDecorator, DecoratorType } from '../enums.js';
import { IComponentDecorator } from '../interfaces.js';
import { DataComponentInfo } from './data-component.info.js';
import { IDataFieldType } from './data.interfaces.js';


export class DataFieldInfo {
  property: string;
  isDataComponent: boolean;
  dataType: IDataFieldType;
  decorators: IComponentDecorator[];
  elementType?: Omit<IDataFieldType, 'array'>;

  constructor(fieldDecorator: IComponentDecorator, comp: ComponentInfo, dataComponents: ComponentInfo[]) {
    const { dataType, elementType } = fieldDecorator.data;

    let dataComponent;

    if (typeof dataType === 'function') {
      dataComponent = dataComponents.find(dc => dc.getClass() === dataType);
    }

    if (dataComponent) {
      this.dataType = new DataComponentInfo(dataComponent, dataComponents);
    }
    else {
      this.dataType = dataType.name.toLowerCase();
    }

    this.property = fieldDecorator.property!;
    this.isDataComponent = !!dataComponent;
    this.elementType = elementType;
    this.decorators = comp
      .getDecorators({
        property: fieldDecorator.property,
        placement: [DecoratorType.PROPERTY]
      })
      .filter(decorator => decorator.id !== CoreDecorator.FIELD);
  }

  getFieldDecorators(id: string) {
    return this.decorators.filter(decorator => decorator.id === id);
  }

}