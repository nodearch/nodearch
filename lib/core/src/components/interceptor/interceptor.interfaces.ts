import { IUseProvider } from '../component/interfaces.js';

export interface IInterceptor<T = any> extends IUseProvider<any, T> {
  before?(): void | Promise<void>;
  after?(): void | Promise<void>;
}