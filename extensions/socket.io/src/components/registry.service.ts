import { AppContext, Logger, Service } from '@nodearch/core';
import * as IO from 'socket.io';
import { IEventHandlerInput, IMiddlewareFunction, INamespace, INamespaceInfo, INamespaceMap, ISubscriptionInfo } from '../interfaces.js';
import { ComponentInfo, MethodParameters } from '@nodearch/core/components';
import { SocketIODecorator } from '../enums.js';


@Service()
export class RegistryService {
  constructor(
    private readonly logger: Logger
  ) { }


  register(io: IO.Server, namespaceInfo: INamespaceInfo, namespace: ComponentInfo) {
    namespaceInfo.events.forEach((eventInfo) => {
      const controllerMethod = `${eventInfo.eventComponent.getClass().name}.${eventInfo.eventMethod}`;
      this.logger.info(`Register (${namespaceInfo.name}) (${eventInfo.eventName}) (${controllerMethod})`);
    });

    const nsp = io.of(namespaceInfo.name);

    nsp.use(this.getDefaultMiddleware(namespace));

    nsp.on('connection', (socket) => {
      this.onConnection(socket, namespaceInfo)
        .catch((err) => {
          this.logger.error(err);
          socket.disconnect();
        });
    });
  }

  private getDefaultMiddleware(namespace: ComponentInfo<INamespace>): IMiddlewareFunction {
    return (socket, next) => {
      const nsInstance = namespace.getInstance();

      (socket as any).nodearch = {
        namespaceInstance: nsInstance
      };

      if (nsInstance.middleware) {
        nsInstance.middleware(socket)
          .then(() => next())
          .catch(next);
      }
      else {
        next();
      }
    }
  }

  private async onConnection(socket: IO.Socket, namespaceInfo: INamespaceInfo) {
    this.logger.info(`New socket connected - (Namespace) ${socket.nsp.name} (ID) ${socket.id}`);

    socket.on('disconnect', () => {
      this.onDisconnect(socket, namespaceInfo);
    });

    const nsInstance = (socket as any).nodearch.namespaceInstance as INamespace;

    const onConnection = nsInstance.onConnection;

    if (onConnection) {
      await onConnection.call(nsInstance, socket);
      
      if (socket.disconnected) {
        return;
      }
    }

    socket.onAny((eventName, ...args) => {
      this.onAny(socket, namespaceInfo, eventName, ...args);
    });

    namespaceInfo.events.forEach((eventInfo) => {
      const { eventName, eventComponent, eventMethod } = eventInfo;

      const depKey = namespaceInfo.dependenciesKeys.find(x => x.component === eventComponent.getClass())!.key;

      const componentInstance = (nsInstance as any)[depKey];

      const componentEventHandler = componentInstance[eventMethod].bind(componentInstance);

      socket.on(eventName, this.getEventHandler(socket, namespaceInfo, eventInfo, componentEventHandler));
    });
  }

  private async onAny(socket: IO.Socket, namespaceInfo: INamespaceInfo, eventName: string, ...args: any[]) {
    const nsInstance = (socket as any).nodearch.namespaceInstance as INamespace;

    const onAny = nsInstance.onAny;

    if (onAny) {
      await onAny.call(nsInstance, eventName, ...args);
    }

    if (!namespaceInfo.events.find(x => x.eventName === eventName)) {
      this.logger.warn(`Event (${eventName}) does not exist in namespace (${namespaceInfo.name})`);
    }
  }

  private async onDisconnect(socket: IO.Socket, namespaceInfo: INamespaceInfo) {
    this.logger.info(`Socket disconnected - (Namespace) ${socket.nsp.name} (ID) ${socket.id}`);
    
    const nsInstance = (socket as any).nodearch.namespaceInstance as INamespace;

    const onDisconnect = nsInstance.onDisconnect;

    if (onDisconnect) {
      await onDisconnect.call(nsInstance, socket);
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