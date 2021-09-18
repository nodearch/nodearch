import { ClassConstructor, Container, Logger, Service } from '@nodearch/core';
import { IEventSubscribe, IEventSubscribeMetadata, INamespaceEvents, IControllerNamespaceMetadata, ISocketIOController, INamespaceMetadata, INamespaceInfo, INamespaceControllerMetadata } from '../interfaces';
import { MetadataManager } from '../metadata';
import io, { Socket } from 'socket.io';
import { SocketIOConfig } from './socketio.config';
import { EventHandlerParamType } from '../enums';

interface IControllerMetadata {
  eventsMetadata: IEventSubscribeMetadata[];
  controller: ClassConstructor;
}

@Service()
export class SocketIOService {

  private ioServer: io.Server;
  private logger: Logger;

  constructor(config: SocketIOConfig, logger: Logger) {
    this.ioServer = config.ioServer;
    this.logger = logger;
  }

  /**
   * Return a list of Metadata for controllers that contains 
   * socket.io events and namespaces
   */
  getControllersMetadata(controllers: ClassConstructor[]) {
    const controllersMetadata: IControllerMetadata[] = []; 

    controllers.forEach(ctrl => {
      const eventsMetadata = MetadataManager.getSubscribes(ctrl);
      
      if (eventsMetadata) {
        controllersMetadata.push({
          eventsMetadata, 
          controller: ctrl
        });
      }
    });

    return controllersMetadata;
  }

  /**
   * Get a list of namespaces and their events
   */
  getNamespacesMetadata(controllersMetadata: IControllerMetadata[]) {
    // temporary map to get a unique list of namespaces 
    const namespacesMap: Map<string, INamespaceInfo> = new Map();

    controllersMetadata.forEach(ctrl => {
      const namespaces = MetadataManager.getControllerNamespaces(ctrl.controller);

      ctrl.eventsMetadata.forEach(eventMetadata => {
        // Try to match the event with a namespace and then add it to the map
        let namespace: IControllerNamespaceMetadata | undefined;

        // find a namespace that matches the method name
        namespace = namespaces.find(ns => {
          return ns.method === eventMetadata.method;
        });

        if (!namespace) {
          // find a controller level namespace
          namespace = namespaces.find(ns => {
            return !ns.method;
          });
        }

        if (!namespace) throw new Error(`[Socket.IO] Namespace not found for the event: ${eventMetadata.eventName} in: ${ctrl.controller.name}.${eventMetadata.method}`);
    
        const existingNamespace = namespacesMap.get(namespace.name);
        
        if (existingNamespace) {
          existingNamespace.events.push({...eventMetadata, controller: ctrl.controller});
        }
        else {
          const namespaceInfo = MetadataManager.getNamespace(namespace.classRef);
          
          if (!namespaceInfo) throw new Error(`[Socket.IO] Namespace ${namespace.classRef.name} it not a valid class component, make sure you're using @Namespace decorator`);

          namespacesMap.set(namespace.name, { 
            classRef: namespace.classRef, 
            metadata: namespaceInfo, 
            events: [{...eventMetadata, controller: ctrl.controller}] 
          });

        }
      });
    });

    // no need for the map anymore, we should already them unique
    return Array.from(namespacesMap.values());
  }

  /**
   * Given a socket, events and all the metadata, register the events to the socket 
   */
  registerEvents(socket: Socket, events: IEventSubscribe[], nsControllers: INamespaceControllerMetadata[], nsInstance: any) {
    events.forEach(event => {
      const { instanceKey } = nsControllers.find(nsCtrl => nsCtrl.classRef === event.controller) as INamespaceControllerMetadata; 
      
      const controllerInstance = nsInstance[instanceKey];
    
      socket.on(event.eventName, (data) => {
        controllerInstance[event.method](
          ...this.getEventHandlerParams(data, socket, event)
        );
      });
    });
  }

  /**
   * Get an ordered object with the requested params for a given event handler 
   */
  private getEventHandlerParams(data: any, socket: io.Socket, event: IEventSubscribeMetadata) {
    const params: any[] = [];
    
    event.params.forEach(param => {
      switch(param.type) {
        case EventHandlerParamType.EVENT_DATA:
          params[param.index] = data;
          break;
        case EventHandlerParamType.SOCKET_INFO:
          params[param.index] = socket;
          break;
      }
    });

    return params;
  }

}