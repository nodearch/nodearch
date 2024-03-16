import { AppContext, Logger, Service } from '@nodearch/core';
import { SocketIODecorator } from '../enums.js';
import { ClassConstructor } from '@nodearch/core/utils';
import { INamespaceMap, ISubscriptionInfo, ISubscriptionOptions, INamespaceInfo, IEventHandlerInput } from '../interfaces.js';
import { DefaultNamespace } from './default-namespace.js';
import { ComponentFactory, ComponentInfo, IComponentDecoratorInfo } from '@nodearch/core/components';


/**
 * The ParserService class is responsible for parsing socket events and namespaces
 * in order to build a map of namespaces and their corresponding events.
 */
@Service()
export class ParserService {

  private namespacesMap: INamespaceMap;

  constructor(
    private readonly appContext: AppContext
  ) {
    this.namespacesMap = new Map();
  }

  /**
   * Parses the socket events and namespaces to build a map of namespaces and their corresponding events.
   * @returns The map of namespaces and their corresponding events.
   */
  parse(): INamespaceMap {
    // Register the default namespace component
    const defaultNs = this.registerDefaultNamespace();

    const registry = this.appContext.getComponentRegistry();

    // Get all socket events @Subscribe 
    const subscribeDecorators = registry.getDecorators<ISubscriptionOptions>({
      id: SocketIODecorator.SUBSCRIBE
    });

    // Get events' namespaces
    subscribeDecorators.forEach((decorator) => {
      const namespaceComponentInfo = this.getEventNamespace(decorator, defaultNs);

      const eventHandlerParams = this.getEventHandlerParams(decorator);

      this.registerEvent(namespaceComponentInfo, decorator, eventHandlerParams);
    });

    // Create the dependencies for each namespace component
    this.createNamespaceDependencies();

    return this.namespacesMap;
  }

  /**
   * Registers the default namespace component.
   * This is the namespace that will be used if 
   * no namespace is provided either on the method 
   * or the class of the controller.
   */
  private registerDefaultNamespace() {
    const registry = this.appContext.getComponentRegistry();

    // Register on the main app container.
    registry.register([DefaultNamespace]);

    // Get component info from the registry.
    return registry.getInfo(DefaultNamespace);
  }

  /**
   * Gets the namespace component for the event.
   * @param eventDecorator The event decorator info.
   * @param defaultNs The default namespace component.
   * @returns The namespace component.
   */
  private getEventNamespace(
    eventDecorator: IComponentDecoratorInfo<ISubscriptionOptions>,
    defaultNs: ComponentInfo
  ) {
    // Set the default namespace component as fallback.
    let namespaceComponentInfo: ComponentInfo = defaultNs;

    const registry = this.appContext.getComponentRegistry();

    // Get @Namespace Decorators from the event component
    const namespaceDecorators = eventDecorator
      .componentInfo
      .getDecorators<{ namespaceProvider: ClassConstructor }>({
        id: SocketIODecorator.NAMESPACE
      });

    // First, check if the event has a namespace decorator directly on the method
    let namespaceDecorator = namespaceDecorators.find((ns) => ns.method === eventDecorator.method);

    /**
     * If no method namespace decorator is found, 
     * check if the event component has a namespace decorator on the controller level
     * If not, default namespace will be used automatically, as it is already set.
     */
    if (!namespaceDecorator) {
      namespaceDecorator = namespaceDecorators.find((ns) => !ns.method);
    }

    /**
     * If a namespace decorator is found, get the namespace component info from the registry.
     * If not, the default namespace component will be used, which is already to a ComponentInfo.
     */
    if (namespaceDecorator) {
      namespaceComponentInfo = registry.getInfo(namespaceDecorator.data.namespaceProvider);
    }

    return namespaceComponentInfo;
  }

  /**
   * Gets the event handler parameters.
   */
  private getEventHandlerParams(eventDecorator: IComponentDecoratorInfo<ISubscriptionOptions>) {
    const eventDataParams = eventDecorator
      .componentInfo
      .getDecorators({
        id: SocketIODecorator.EVENT_DATA,
        method: eventDecorator.method
      });

    const socketInfoParams = eventDecorator
      .componentInfo
      .getDecorators({
        id: SocketIODecorator.SOCKET_INFO,
        method: eventDecorator.method
      });

    return [...eventDataParams, ...socketInfoParams]
      .map(param => ({ type: param.id, index: param.paramIndex! }))
      .sort((a, b) => a.index - b.index) as IEventHandlerInput[];
  }

  /**
   * Registers the event to the namespace component.
   */
  private registerEvent(
    namespaceComponent: ComponentInfo,
    subscribeDecorator: IComponentDecoratorInfo<ISubscriptionOptions>,
    handlerInputs: IEventHandlerInput[]
  ) {
    const event: ISubscriptionInfo = {
      eventName: subscribeDecorator.data.eventName,
      eventMethod: subscribeDecorator.method!,
      eventComponent: subscribeDecorator.componentInfo,
      methodInputs: handlerInputs
    };

    // Check if the namespace component is already in the map
    if (this.namespacesMap.has(namespaceComponent)) {
      // If it is, just add the event to the existing namespace component
      this.namespacesMap.get(namespaceComponent)!.events.push(event);
    }
    else {
      // If it's not, create a new namespace info and add it to the map
      const namespaceInfo: INamespaceInfo = {
        name: namespaceComponent.getData().name,
        events: [event],
        dependenciesKeys: []
      };

      this.namespacesMap.set(namespaceComponent, namespaceInfo);
    }
  }

  /**
   * Creates the dependencies for each namespace component.
   * We need to be able to get the namespace component instance 
   * once from the DI container and then get the event components' 
   * instances from the namespace component.
   * This is require in cases where Request scope is used.
   * Because in this case we can't make multiple get calls to the DI container.
   */
  private createNamespaceDependencies() {
    this.namespacesMap.forEach((namespaceInfo, namespace) => {
      const componentsClasses = namespaceInfo.events.map((event) => {
        return event.eventComponent.getClass();
      });

      // Remove duplicate classes
      const uniqueClasses = Array.from(new Set(componentsClasses));

      const deps = ComponentFactory.addComponentDependencies(namespace.getClass(), uniqueClasses);

      namespaceInfo.dependenciesKeys = deps;
    });
  }
}