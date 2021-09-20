import { ClassConstructor, Logger, Service } from '@nodearch/core';
import { 
  IEventSubscribe, IEventSubscribeMetadata, 
  IControllerNamespaceMetadata, INamespaceInfo, 
  INamespaceControllerMetadata, IControllerMetadata 
} from '../interfaces';
import { MetadataManager } from '../metadata';
import io, { Socket } from 'socket.io';
import { HandlerParamType } from '../enums';


@Service()
export class SocketIOService {

  constructor(private readonly logger: Logger) {}

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
    const namespacesMap: Map<ClassConstructor, INamespaceInfo> = new Map();

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
    
        const existingNamespace = namespacesMap.get(namespace.classRef);
        
        if (existingNamespace) {
          existingNamespace.events.push({...eventMetadata, controller: ctrl.controller});
        }
        else {
          const nsName = MetadataManager.getNamespaceName(namespace.classRef);          
          if (!nsName) throw new Error(`[Socket.IO] Namespace ${namespace.classRef.name} it not a valid class component, make sure you're using @Namespace decorator`);

          namespacesMap.set(namespace.classRef, { 
            classRef: namespace.classRef, 
            name: nsName, 
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
  registerEvents(events: IEventSubscribe[], nsControllers: INamespaceControllerMetadata[], socket: Socket, nsInstance: any) {
    events.forEach(event => {
      const { instanceKey } = nsControllers.find(nsCtrl => nsCtrl.classRef === event.controller) as INamespaceControllerMetadata; 
      
      const controllerInstance = nsInstance[instanceKey];
    
      // TODO: implement https://socket.io/docs/v4/emitting-events/#acknowledgements
      // TODO: data object is only the first argument, we need to do ...data
      // TODO: implement validation https://socket.io/docs/v4/listening-to-events/#validation
      // TODO: implement error handling
      socket.on(event.eventName, (data, cb) => {
          // Async, so it works even if the handler was not returning promise
          (async () => {
            
            return await controllerInstance[event.method](
              ...this.getEventHandlerParams(event, socket, data)
            );

          })()
          .then(res => {
            if (res && cb) {
              cb(res);
            }
            else if (cb) {
              // safe return in case nothing was returned from the handler
              cb({});
            }
          })
          .catch(err => {
            if (cb) {
              cb({
                error: err.message,
                data: err.data
              });
            }
            else {
              this.logger.error('[Socket.IO]', err);
            }
          });
      });
    });
  }

  /**
   * Get an ordered object with the requested params for a given event handler 
   */
  private getEventHandlerParams(event: IEventSubscribeMetadata, socket: io.Socket, data: any) {
    const params: any[] = [];
    // TODO: verify that params[param.index] is actually working as intended
    event.params.forEach(param => {
      switch(param.type) {
        case HandlerParamType.EVENT_DATA:
          params[param.index] = data;
          break;
        case HandlerParamType.SOCKET_INFO:
          params[param.index] = socket;
          break;
      }
    });

    return params;
  }
}