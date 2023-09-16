import { ClassConstructor, Logger, Service } from '@nodearch/core';
import { INamespace, INamespaceInfo } from '../interfaces';
import { MetadataManager } from '../metadata';
import { SocketIOConfig } from './socketio.config';
import { SocketIOService } from './socketio.service';

@Service()
export class NamespaceService {

  private dependencyFactory!: (id: ClassConstructor) => any;
  private namespacesInfo: INamespaceInfo[] = [];

  constructor(
    private readonly logger: Logger,
    private readonly socketIOService: SocketIOService,
    private readonly socketIOConfig: SocketIOConfig
  ) { }

  init(dependencyFactory: (id: ClassConstructor) => any) {
    this.dependencyFactory = dependencyFactory;
  }

  create(namespaceInfo: INamespaceInfo) {
    this.namespacesInfo.push(namespaceInfo);

    const nsControllers = MetadataManager.getNamespaceControllers(namespaceInfo.classRef);

    this.logger.debug(`[Socket.IO] Register Namespace: ${namespaceInfo.name}`);

    this.socketIOConfig
      .ioServer
      .of(namespaceInfo.name)
      .use((socket, next) => {
        this.logger.debug(`[Socket.IO] Executing Middleware for Namespace: ${namespaceInfo.name}`);

        // get the namespace instance with every new connection and pass it via data
        const nsInstance: INamespace = this.dependencyFactory(namespaceInfo.classRef);

        socket.data.nodearch = {
          nsInstance
        };

        // TODO: check if this is affected by the foreach scope?
        nsInstance.middleware?.(socket)
          .then(() => next())
          .catch((err) => next(err));
      })
      .on('connection', (socket) => {
        const nsInstance: INamespace = socket.data.nodearch.nsInstance;

        this.socketIOService.registerEvents(
          namespaceInfo.events,
          nsControllers,
          socket,
          nsInstance
        );

        nsInstance.onConnection?.(socket);

        this.logger.debug(`[Socket.IO] New socket connected: ${socket.id}`);

        // TODO: add catch all events https://socket.io/docs/v4/listening-to-events/#catch-all-listeners
        // TODO: add all remaining events, like on error, on connect_error, etc.

        socket.on('disconnect', () => {
          nsInstance.onDisconnect?.(socket);

          this.logger.debug(`[Socket.IO] Socket disconnected: ${socket.id}`);
        });
      });
  }

  getDynamicNamespaces() {
    return this.namespacesInfo.filter(nsInfo => nsInfo.name instanceof RegExp);
  }

  getDynamicNamespace(name: string) {
    return this.namespacesInfo.find(nsInfo => (nsInfo.name instanceof RegExp) && name.match(nsInfo.name));
  }
}