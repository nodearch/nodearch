import { AppContext, Logger, Service } from '@nodearch/core';
import * as IO from 'socket.io';
import { IEventHandlerInput, IMiddlewareFunction, INamespaceInfo, INamespaceMap, ISubscriptionInfo } from '../interfaces.js';
import { MethodParameters } from '@nodearch/core/components';
import { SocketIODecorator } from '../enums.js';


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

          const componentEventHandler = componentInstance[eventMethod].bind(componentInstance);

          socket.on(eventName, this.getEventHandler(socket, namespaceInfo, eventInfo, componentEventHandler));
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

  private getDefaultMiddleware(namespaceInfo: INamespaceInfo): IMiddlewareFunction {
    return (socket, next) => {
      // this.logger.info(`Middleware: ${namespaceInfo.name}`);
      // subscriptions.forEach((subscription) => {
      //   subscription.
      // });

      next();
    }
  }

  private getEventHandler(
    socket: IO.Socket,
    namespaceInfo: INamespaceInfo,
    eventInfo: ISubscriptionInfo,
    componentEventHandler: any
  ) {
    return (...socketArgs: any[]) => {
      this.logger.info(`(Event) ${eventInfo.eventName} (Namespace) ${namespaceInfo.name} (Socket ID) ${socket.id}`);

      let ack: any;

      // If last socket argument is an function, it's the ack function. Remove it from the args.
      if (typeof socketArgs[socketArgs.length - 1] === 'function') {
        ack = socketArgs.pop();
      }

      const args = this.getEventHandlerArgs(socket, eventInfo, socketArgs);

      (async () => {

        try {
          const result = await componentEventHandler(...args);

          if (ack) {
            ack(result);
          }
        }
        catch (err: any) {
          if (ack) {
            ack({
              error: err.message,
              data: err.data
            });
          }
          else {
            this.logger.error(err);
          }
        }

      })();
    }
  }

  private getEventHandlerArgs(socket: IO.Socket, eventInfo: ISubscriptionInfo, socketArgs: any[]): any[] {

    const args = MethodParameters.getArguments({
      component: eventInfo.eventComponent,
      method: eventInfo.eventMethod,
      decorators: [
        {
          id: SocketIODecorator.EVENT_DATA,
          arg: (data) => data.index !== undefined ? socketArgs[data.index] : socketArgs
        },
        {
          id: SocketIODecorator.SOCKET_INFO,
          arg: socket
        }
      ]
    });

    return args;
  }
}