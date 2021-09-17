import { ClassConstructor, Container, Logger, Service } from '@nodearch/core';
import { IEventSubscribe, IEventSubscribeMetadata, INamespaceEvents, INamespaceMetadata, ISocketIOController } from '../interfaces';
import { MetadataManager } from '../metadata';
import io from 'socket.io';
import { SocketIOConfig } from './socketio.config';
import { EventHandlerParamType } from '../enums';


@Service()
export class SocketIOService {

  private ioServer: io.Server;
  private logger: Logger;

  constructor(config: SocketIOConfig, logger: Logger) {
    this.ioServer = config.ioServer;
    this.logger = logger;
  }

  filterSocketIOControllers(controllers: ClassConstructor[]) {
    const socketIOControllers: ISocketIOController[] = [];

    controllers.forEach(ctrl => {
      const subscribesMetadata = MetadataManager.getSubscribes(ctrl);
      
      if (subscribesMetadata.length) {

        const namespaces = MetadataManager.getNamespaces(ctrl);

        const subscribes = subscribesMetadata.map(subscribeMetadata => {
          
          let namespace: INamespaceMetadata | undefined;

          // find a namespace that matches the method name
          namespace = namespaces.find(ns => {
            return ns.method === subscribeMetadata.method;
          });

          if (!namespace) {
            // find a controller level namespace
            namespace = namespaces.find(ns => {
              return !ns.method;
            });
          }

          if (!namespace) throw new Error(`[Socket.IO] Namespace not found for the event: ${subscribeMetadata.eventName} in: ${ctrl.name}.${subscribeMetadata.method}`);
          
          return {
            ...subscribeMetadata,
            namespaceName: namespace.name,
            namespaceClass: namespace.classRef
          } as IEventSubscribe;
        });

        socketIOControllers.push({
          controller: ctrl,
          events: subscribes
        });
      }

    });

    return socketIOControllers;
  }

  registerEvents(socketIOControllers: ISocketIOController[], depFactory: () => Record<string, Object>[]) {
    
    // flip the Controllers info to get unique namespaces at the top
    const namespaceEvents: Map<string, INamespaceEvents[]> = new Map();

    socketIOControllers.forEach(ctrlInfo => {
      ctrlInfo.events.forEach(event => {


        const existingNamespace = namespaceEvents.get(event.namespaceName);
        
        if (existingNamespace) {
          existingNamespace.push({ controller: ctrlInfo.controller, ...event });
        }
        else {
          namespaceEvents.set(event.namespaceName, [{ controller: ctrlInfo.controller, ...event }]);
        }

      });
    });

    // Create and validate namespaces
    this.ioServer.of((name, auth, next) => {
      next(null, namespaceEvents.get(name) ? true : false);
    })
    .use((socket, next) => {
      // console.log('from middleware');
      // socket.data.nodearch = 'nodearch';
      // // TODO: wrap all the context middleware into this one before forwarding to the onConnection via socket.data
      

      const events = namespaceEvents.get(socket.nsp.name) as INamespaceEvents[];
      const controllers = depFactory();

      // TODO: We need to get namespaces and their metadata e.g. middleware
      // organize the data structure, i.e. set the namespace metadata alongside the events in the map 
      

      next();
    })
    .on('connection', (socket) => {
      console.log('a user connected on', socket.nsp.name, 'with data', socket.data.nodearch);
    })
    .on('connection', () => {
      console.log('connection 2');
    });


    // this.ioServer.on('connection', (socket) => {
    //   socket.on('disconnect', () => {
    //     this.logger.debug(`Socket ${socket.id} disconnected!`); 
    //   });

    //   this.logger.debug(`New socket connected: ${socket.id}`); 

    //   const controllers = depFactory();

    //   socketIOControllers.forEach(ctrlInfo => {
          
    //     const controller = controllers.find(ctrl => {
    //       return ctrl.constructor === ctrlInfo.controller;
    //     });

    //     if (controller) {
    //       console.log(ctrlInfo.namespaces[0].classRef);
    //       console.log('namespace', controller[ctrlInfo.namespaces[0].instanceKey]);
    //     }

    //     ctrlInfo.events.forEach(event => {
    //       socket.on(event.eventName, (data) => {
    //         /**
    //          * controller should always be there 
    //          * because we can't reach this point 
    //          * unless the controller is bound on the container
    //          */
    //         (controller![event.method] as Function)(
    //           ...this.getEventHandlerParams(data, socket, event)
    //         );
    //       });
    //     });
    //   });
    // });
  }

  private registerNamespaceEvents(events: INamespaceEvents) {

  }

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