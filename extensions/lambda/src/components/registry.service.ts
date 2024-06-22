import { AppContext, Logger, Service } from '@nodearch/core';
import { ComponentInfo } from '@nodearch/core/components';
import { LambdaDecorator } from '../enums.js';


@Service()
export class RegistryService {
  private registry: Map<string, { method: string, componentInfo: ComponentInfo }>;

  constructor(
    private appContext: AppContext,
    private logger: Logger
  ) {
    this.registry = new Map();
    this.load();
  }

  private load() {
    const decorators = this.appContext.getComponentRegistry().getDecorators({ id: LambdaDecorator.LAMBDA_HANDLER });

    decorators.forEach((decorator) => {
      const name = decorator.data.name;
      const method = decorator.method!;
      const componentInfo = decorator.componentInfo;
      
      this.registry.set(name, { method, componentInfo });

      this.logger.info(`Handler registered - ${name}`);
    });
  }

  get(name: string) {
    return this.registry.get(name);
  }

  list() {
    return Array.from(this.registry.keys());
  }
}