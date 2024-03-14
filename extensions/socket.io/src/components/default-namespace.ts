import { Namespace } from '../decorators.js';
import { INamespace, INamespaceArgs } from '../interfaces.js';

@Namespace('/', { export: true })
export class DefaultNamespace implements INamespace {
  async handler(data: { args: INamespaceArgs; }) {

  }
}