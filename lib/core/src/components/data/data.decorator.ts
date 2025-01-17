import { ComponentFactory } from '../component-factory.js';
import { CoreDecorator } from '../enums.js';
import { IComponentOptions } from '../interfaces.js';

export const Data = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreDecorator.DATA, options });

export const Field = (elementType?: any): PropertyDecorator => 
  ComponentFactory.propertyDecorator({ 
    id: CoreDecorator.FIELD,
    fn(target, propKey) {

      const dataType = Reflect.getMetadata('design:type', target, propKey);

      if (dataType === Array && !elementType) {
        throw new Error(`Field ${propKey.toString()} on class ${target.constructor.name} is an array. Please provide the element type. Example: @Field(String)`);
      }

      return {
        dataType,
        elementType
      };
    }, 
  });