import { AppContext, Logger, Service } from '@nodearch/core';
import * as IO from 'socket.io';
import { IMiddlewareFunction, INamespaceInfo, INamespaceMap, ISubscriptionInfo } from '../interfaces.js';
import { ComponentInfo, ComponentFactory } from '@nodearch/core/components';
import { DefaultNamespace } from './default-namespace.js';


@Service()
export class RegistryService {
  constructor(
    private readonly logger: Logger,
    private readonly appContext: AppContext
  ) { }


  register(io: IO.Server, namespaceMap: INamespaceMap) {
    let hasDefaultNamespace = false;

    namespaceMap.forEach((namespaceInfo, namespace) => {
      namespaceInfo.events.forEach((eventInfo) => {
        const controllerMethod = `${eventInfo.eventComponent.getClass().name}.${eventInfo.eventMethod}`;
        this.logger.info(`Register (${namespaceInfo.name}) (${eventInfo.eventName}) (${controllerMethod})`);
      });

      if (namespaceInfo.name === '/') {
        hasDefaultNamespace = true;
      }

      const nsp = io.of(namespaceInfo.name);

      // TODO: support namespace middlewares

      // nsp.use(this.getDefaultMiddleware(namespaceInfo));

      nsp.on('connection', (socket) => {
        this.logger.info(`New socket connected - ID: ${socket.id}`);

        // Initialize namespace & dependencies instances with each connection.
        const nsInstance = namespace.getInstance();

        socket.onAny((eventName, ...args) => {
          if (!namespaceInfo.events.find(x => x.eventName === eventName)) {
            this.logger.warn(`Event (${eventName}) does not exist in namespace (${namespaceInfo.name})`); 
          }
        });

        namespaceInfo.events.forEach((eventInfo) => {
          const { eventName, eventComponent, eventMethod } = eventInfo;
          
          const depKey = namespaceInfo.dependenciesKeys.find(x => x.component === eventComponent.getClass())!.key;

          const componentInstance = nsInstance[depKey];
          
          const eventHandler = componentInstance[eventMethod].bind(componentInstance);

          socket.on(eventName, (...args) => {
            this.logger.info(`(Event) ${eventName} (Namespace) ${namespaceInfo.name} (Socket ID) ${socket.id}`);
            // TODO: update args, use decorators, and handle outputs and errors.
            eventHandler({ args, socket });
          });
        });

        socket.on('disconnect', () => {
          this.logger.info(`Socket disconnected - ID: ${socket.id}`);
        });
      });

    });

    if (!hasDefaultNamespace) {
      io
        .of('/')
        .use((socket, next) => {
          this.logger.warn(`Default namespace not allowed - Socket ID: ${socket.id}`);
          next(new Error('Default namespace not allowed'));
        });
    }
  }

  getDefaultMiddleware(namespaceInfo: INamespaceInfo): IMiddlewareFunction {
    return (socket, next) => {
      // this.logger.info(`Middleware: ${namespaceInfo.name}`);
      // subscriptions.forEach((subscription) => {
      //   subscription.
      // });

      next();
    }
  }
}