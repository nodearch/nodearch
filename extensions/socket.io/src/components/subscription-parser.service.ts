import { AppContext, Logger, Service } from '@nodearch/core';
import { SocketIODecorator } from '../enums.js';
import { ClassConstructor } from '@nodearch/core/utils';
import { INamespace, INamespaceOptions, ISubscriptionInfo, ISubscriptionOptions, NamespaceName } from '../interfaces.js';
import { DefaultNamespace } from './default-namespace.js';


@Service()
export class SubscriptionParserService {
  
  constructor(
    private readonly logger: Logger,
    private readonly appContext: AppContext
  ) {}

  parse() {
    const registry = this.appContext.getComponentRegistry();

    const subscriptions: ISubscriptionInfo[] = [];
  
    // Get all socket events @Subscribe 
    const subscribeDecorators = registry.getDecorators<ISubscriptionOptions>({
      id: SocketIODecorator.SUBSCRIBE
    });

    // Get events' namespaces
    subscribeDecorators.forEach((decorator) => {
      const namespace = registry.getDecorators<INamespaceOptions>({
        id: SocketIODecorator.NAMESPACE,
        method: decorator.method
      });

      /**
       * Try to get the namespace in that order:
       * 1. Method namespace
       * 2. Class namespace
       * 3. Default namespace
       */ 
      const classNamespace = namespace.find((ns) => !ns.method);
      const methodNamespace = namespace.find((ns) => ns.method);
      const namespaceDecorator = methodNamespace || classNamespace;
      let namespaceName: NamespaceName = '/';

      if (namespaceDecorator) {
        namespaceName = namespaceDecorator.data.name;
      }

      subscriptions.push({
        namespace: namespaceName,
        eventName: decorator.data.eventName,
        eventComponent: decorator.componentInfo,
        eventMethod: decorator.method!
      });
    });

    const namespacesMap = new Map<NamespaceName, ISubscriptionInfo[]>();

    subscriptions.forEach((subscription) => {
      const { namespace } = subscription;
            
      if (!namespacesMap.has(namespace)) {
        namespacesMap.set(namespace, [subscription]);
      }
      else {
        namespacesMap.get(namespace)!.push(subscription);
      }

    });

    return namespacesMap;
  }

}