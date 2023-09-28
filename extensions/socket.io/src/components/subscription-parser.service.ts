import { AppContext, Logger, Service } from '@nodearch/core';
import { SocketIODecorator } from '../enums.js';
import { ClassConstructor } from '@nodearch/core/utils';
import { INamespace, INamespaceComponentOptions, ISubscriptionInfo, ISubscriptionOptions, NamespaceName } from '../interfaces.js';
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
  
    const subscribeDecorators = registry.getDecorators<ISubscriptionOptions>({
      id: SocketIODecorator.SUBSCRIBE
    });

    subscribeDecorators.forEach((decorator) => {
      const namespace = registry.getDecorators({
        useId: SocketIODecorator.NAMESPACE,
        method: decorator.method
      });

      const classNamespace = namespace.find((ns) => !ns.method);
      const methodNamespace = namespace.find((ns) => ns.method);
      const namespaceDecorator = methodNamespace || classNamespace;
      let namespaceName: NamespaceName = '/';

      if (namespaceDecorator) {
        const namespaceComponent = registry.getInfo<INamespace, INamespaceComponentOptions>(namespaceDecorator.data.component);
        namespaceName = namespaceComponent.getData()!.name;
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