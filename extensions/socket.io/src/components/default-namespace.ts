import { NamespaceProvider } from '../decorators.js';
import { INamespace, INamespaceArgs } from '../interfaces.js';

@NamespaceProvider('/')
export class DefaultNamespace implements INamespace {
  async handler(data: { args: INamespaceArgs; }) {

  }
}