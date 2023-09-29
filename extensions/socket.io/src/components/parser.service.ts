import { AppContext, Logger, Service } from '@nodearch/core';
import { SocketIODecorator } from '../enums.js';
import { ClassConstructor } from '@nodearch/core/utils';
import { INamespaceMap, ISubscriptionInfo, ISubscriptionOptions, INamespaceInfo } from '../interfaces.js';
import { DefaultNamespace } from './default-namespace.js';
import { ComponentInfo, IComponentDecoratorInfo } from '@nodearch/core/components';


@Service()
export class ParserService {
  
  private namespacesMap: INamespaceMap;

  constructor(
    private readonly logger: Logger,
    private readonly appContext: AppContext
  ) {
    this.namespacesMap = new Map();
  }

  parse(): INamespaceMap {
    const registry = this.appContext.getComponentRegistry();

    const defaultNs = registry.getInfo(DefaultNamespace);

    // Get all socket events @Subscribe 
    const subscribeDecorators = registry.getDecorators<ISubscriptionOptions>({
      id: SocketIODecorator.SUBSCRIBE
    });

    // Get events' namespaces
    subscribeDecorators.forEach((decorator) => {
      const namespaces = registry.getDecorators<{ component: ClassConstructor }>({
        useId: SocketIODecorator.NAMESPACE,
        method: decorator.method
      });

      let namespaceComponentInfo: ComponentInfo;

      // Get @Use decorators containing namespace e.g. @Use(UserNamespace) on methods/classes  
      const useNamespaceDecorator = namespaces.find((ns) => ns.method) || 
        namespaces.find((ns) => !ns.method);

      // Get the namespace ComponentInfo or set the default namespace's ComponentInfo
      namespaceComponentInfo = useNamespaceDecorator ? 
        registry.getInfo(useNamespaceDecorator.data.component) : defaultNs;

      this.addNamespace(namespaceComponentInfo, decorator);
    });

    return this.namespacesMap;
  }

  private addNamespace(namespaceComponent: ComponentInfo, subscribeDecorator: IComponentDecoratorInfo<ISubscriptionOptions>) {
    const event: ISubscriptionInfo = {
      eventName: subscribeDecorator.data.eventName,
      eventMethod: subscribeDecorator.method!,
      eventComponent: subscribeDecorator.componentInfo
    };

    if (!this.namespacesMap.has(namespaceComponent)) {
      const namespaceInfo: INamespaceInfo = {
        name: namespaceComponent.getData().name,
        events: [event]
      };

      this.namespacesMap.set(namespaceComponent, namespaceInfo);
    }
    else {
      this.namespacesMap.get(namespaceComponent)!.events.push(event);
    }
  }

}