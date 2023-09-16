import { AppContext, Hook, Logger } from '@nodearch/core';
import { SocketIODecorator } from '../enums.js';

@Hook()
export class SocketIOHook {

  constructor(
    private readonly logger: Logger,
    private readonly appContext: AppContext
  ) {}

  async onStart() {
    this.logger.info('SocketIOHook onStart');
    
    const subscriptions: any[] = [];

    const subscribeDecorators = this.appContext.getComponentRegistry().getDecorators({
      id: SocketIODecorator.SUBSCRIBE
    });

    subscribeDecorators.forEach((decorator) => {
      const namespace = this.appContext.getComponentRegistry().getDecorators({
        useId: SocketIODecorator.NAMESPACE,
        method: decorator.method
      });

      const classNamespace = namespace.find((ns) => !ns.method);
      const methodNamespace = namespace.find((ns) => ns.method);
      const namespaceDecorator = methodNamespace || classNamespace;

      if (namespaceDecorator) {
        subscriptions.push({
          eventName: decorator.data.eventName,
          eventDecorator: decorator,
          namespaceDecorator: namespaceDecorator
        });
      }
    });

    console.log(subscriptions);
  }
}