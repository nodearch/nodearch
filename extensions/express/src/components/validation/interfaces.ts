import { ClassConstructor } from '@nodearch/core/utils';


export interface IValidationProvider {
  validate(component: ClassConstructor, method: string, data: IValidationData): IValidationProviderResponse;
}

export type IValidationProviderResponse = Promise<
  (IValidationData & {result: true}) | IValidationErrorInfo
>;

export interface IValidationData {
  headers?: Record<string, string | string[] | undefined>;
  params?: Record<string, any>;
  query?: Record<string, any>;
  body?: any;
}

export interface IValidationErrorInfo {
  result: false;
  message: string;
  details: string[];
}