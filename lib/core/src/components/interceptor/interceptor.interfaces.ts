import { IUseProvider } from '../component/interfaces.js';

export interface IInterceptor<T = any> extends IUseProvider<any, T> {
  before?(): boolean | Promise<boolean>;
  after?(): boolean | Promise<boolean>;
}