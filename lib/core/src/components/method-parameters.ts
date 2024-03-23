import { DecoratorType } from './enums.js';
import { IGetMethodParameters, IParameterDecorator } from './interfaces.js';


/**
 * The `MethodParameters` class provides utility functions to handle method parameter
 * decorations within a given component. It is designed to work with a specific structure
 * of decorators and components, allowing for the extraction and transformation of method
 * parameters based on decorators.
 */
export class MethodParameters {

  /**
   * Retrieves arguments for a method based on its parameter decorators. It organizes
   * and transforms the decorators' data into a consumable format for method invocation.
   * e.g. methodCall(...MethodParameters.getArguments(options)
   */
  static getArguments(options: IGetMethodParameters) {

    const params = [];

    const decoratorsParams = options.decorators
      .map(deco => {
        const paramDecorators = options.component.getDecorators({
          id: deco.id,
          placement: [DecoratorType.PARAMETER],
          method: options.method
        }) as IParameterDecorator[];
      

        return paramDecorators.map(paramDeco => {
          let arg;

          if(typeof deco.arg === 'function') {
            arg = deco.arg(paramDeco.data);
          }
          else {
            arg = deco.arg;
          }

          return {
            index: paramDeco.paramIndex,
            arg
          };
        });
      })
      .flat()
      .sort((a, b) => a.index - b.index);

    if (!decoratorsParams.length) return [];

    const lastParamIndex = decoratorsParams[decoratorsParams.length - 1].index;

    for (let i = 0; i <= lastParamIndex; i++) {
      const decoratorParam = decoratorsParams.find(decoParams => decoParams.index === i);

      if (decoratorParam) {
        params.push(decoratorParam);
      } else {
        params.push(null);
      }
    }

    return params.map(param => param?.arg);
  }
}