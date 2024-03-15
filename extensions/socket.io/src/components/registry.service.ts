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

      this.logger.info(`Registering namespace: ${namespaceInfo.name}`);

      const nsp = io.of(namespaceInfo.name);

      nsp.use(this.getDefaultMiddleware(namespaceInfo));

      nsp.on('connection', (socket) => {
        this.logger.info(`New socket connected - ID: ${socket.id}`);

        // socket.onAny((eventName, ...args) => {
        //   if (!namespaceInfo.events.find(x => x.eventName === eventName)) {
        //     this.logger.warn(`X EVENT: ${eventName} not found`); 
        //   }
        // });

        namespaceInfo.events.forEach((eventInfo) => {
          const { eventName, eventComponent, eventMethod } = eventInfo;
          const componentInstance = eventComponent.getInstance();
          const eventHandler = componentInstance[eventMethod].bind(componentInstance);



          socket.on(eventName, (...args) => {
            this.logger.info(`EVENT: ${eventName}`, args);
            eventHandler({ args, socket });
          });
        });
      });

    });
  }

  getDefaultMiddleware(namespaceInfo: INamespaceInfo): IMiddlewareFunction {
    return (socket, next) => {
      this.logger.info(`Middleware: ${namespaceInfo.name}`);
      // subscriptions.forEach((subscription) => {
      //   subscription.
      // });

      next();
    }
  }
}