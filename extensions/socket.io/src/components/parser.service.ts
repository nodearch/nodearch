import { AppContext, Logger, Service } from '@nodearch/core';
import { SocketIODecorator } from '../enums.js';
import { ClassConstructor } from '@nodearch/core/utils';
import { INamespaceMap, ISubscriptionInfo, ISubscriptionOptions, INamespaceInfo } from '../interfaces.js';
import { DefaultNamespace } from './default-namespace.js';
import { ComponentFactory, ComponentInfo, IComponentDecoratorInfo } from '@nodearch/core/components';


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

    this.appContext.getComponentRegistry().register([DefaultNamespace]);

    const defaultNs = registry.getInfo(DefaultNamespace);

    // Get all socket events @Subscribe 
    const subscribeDecorators = registry.getDecorators<ISubscriptionOptions>({
      id: SocketIODecorator.SUBSCRIBE
    });

    // Get events' namespaces
    subscribeDecorators.forEach((decorator) => {
      let namespaceComponentInfo: ComponentInfo = defaultNs;

      // Get @Use decorators containing namespace e.g. @Use(UserNamespace) on methods/classes  
      const namespaceDecorators = decorator
        .componentInfo
        .getDecorators<{ namespaceProvider: ClassConstructor }>({
          id: SocketIODecorator.NAMESPACE
        });

      let namespaceDecorator = namespaceDecorators.find((ns) => ns.method === decorator.method);

      // If no method namespace decorator is found, use the controller level namespace
      if (!namespaceDecorator) {
        namespaceDecorator = namespaceDecorators.find((ns) => !ns.method);
      }

      if (namespaceDecorator) {
        namespaceComponentInfo = registry.getInfo(namespaceDecorator.data.namespaceProvider);
      }

      this.addNamespace(namespaceComponentInfo, decorator);
    });

    this.namespacesMap.forEach((namespaceInfo, namespace) => {
      const componentsClasses = namespaceInfo.events.map((event) => {
        return event.eventComponent.getClass();
      });

      const uniqueClasses = Array.from(new Set(componentsClasses));

      const deps = ComponentFactory.addComponentDependencies(namespace.getClass(), uniqueClasses);
      
      namespaceInfo.dependenciesKeys = deps;
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
        events: [event],
        dependenciesKeys: []
      };

      this.namespacesMap.set(namespaceComponent, namespaceInfo);
    }
    else {
      this.namespacesMap.get(namespaceComponent)!.events.push(event);
    }
  }

}