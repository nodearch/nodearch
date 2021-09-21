export interface IInterceptorMetadataInfo {
  classDef: any;
  options?: any;
  method?: string;
}

export interface IInterceptorContext {
  component: any;
  methodName: string;
  args: any[];
  paramTypes: string[];
}

export interface IInterceptorConstructor<T = undefined> {
  new(...args: any): IInterceptor<T>;
}

export interface IInterceptor<T = any> {
  before?(context: IInterceptorContext, options: T): Promise<boolean>;
  after?(context: IInterceptorContext, options: T): Promise<boolean>;
}