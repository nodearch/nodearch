import { Logger, Service } from '@nodearch/core';
import * as IO from 'socket.io';
import { IMiddlewareFunction, INamespaceInfo, INamespaceMap, ISubscriptionInfo } from '../interfaces.js';
import { ComponentInfo } from '@nodearch/core/components';


@Service()
export class RegistryService {
  constructor(
    private readonly logger: Logger
  ) { }


  register(io: IO.Server, namespaceMap: INamespaceMap) {

    namespaceMap.forEach((namespaceInfo, namespace) => {

      const nsp = io.of(namespaceInfo.name);

      nsp.use(this.getDefaultMiddleware(namespaceInfo));

      nsp.on('connection', (socket) => {
        this.logger.info(`Socket ${socket.id} connected`);

        // socket.onAny((eventName, ...args) => {
        //   if (!namespaceInfo.events.find(x => x.eventName === eventName)) {
        //     this.logger.warn(`X EVENT: ${eventName} not found`); 
        //   }
        // });

        namespaceInfo.events.forEach((eventInfo) => {
          const { eventName, eventComponent, eventMethod } = eventInfo;
          // const eventHandler = eventComponent.instance[eventMethod].bind(eventComponent.instance);



          socket.on(eventName, (...args) => {
            this.logger.info(`EVENT: ${eventName}`, args);
          });
        });
      });

    });
  }

  getDefaultMiddleware(namespaceInfo: INamespaceInfo): IMiddlewareFunction {
    return (socket, next) => {
      console.log('socket', socket.id, 'from middleware');


      // subscriptions.forEach((subscription) => {
      //   subscription.
      // });

      next();
    }
  }
}