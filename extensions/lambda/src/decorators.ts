import { ComponentFactory, IComponentOptions } from '@nodearch/core/components';
import { LambdaDecorator } from './enums.js';



export function LambdaHandler(name: string) {
  return ComponentFactory.methodDecorator({ id: LambdaDecorator.LAMBDA_HANDLER, fn: () => ({ name }) });
}

