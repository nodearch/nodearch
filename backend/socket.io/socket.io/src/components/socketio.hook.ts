import { ComponentType, Hook, HookContext, IHook, Logger } from '@nodearch/core';
import { SocketIOConfig } from './socketio.config';
import io from 'socket.io';
import { MetadataManager } from '../metadata';
import { SocketIOService } from './socketio.service';
import { INamespace, NativeAdapter } from '../interfaces';
import { Adapter } from '..';


@Hook()
export class SocketIOHook implements IHook {

  private socketIOConfig: SocketIOConfig;
  private socketIOService: SocketIOService;
  private ioServer: io.Server;
  private logger: Logger;


  constructor(socketIOService: SocketIOService, socketIOConfig: SocketIOConfig, logger: Logger) {
    this.socketIOService = socketIOService;
    this.socketIOConfig = socketIOConfig;
    this.ioServer = socketIOConfig.ioServer;
    this.logger = logger;
  }

  async onInit(context: HookContext) {
    const controllers = context.getComponents(ComponentType.Controller);
    if (!controllers) return;

    const controllersMetadata = this.socketIOService.getControllersMetadata(controllers);
    const namespacesMetadata = this.socketIOService.getNamespacesMetadata(controllersMetadata);
    
    namespacesMetadata.forEach(ns => {
      const nsControllers = MetadataManager.getNamespaceControllers(ns.classRef);

      this.logger.debug(`[Socket.IO] Register Namespace: ${ns.name}`);

      this
        .ioServer
        .of(ns.name)
        .use((socket, next) => { 
          this.logger.debug(`[Socket.IO] Executing Middleware for Namespace: ${ns.name}`);

          // get the namespace instance with every new connection and pass it via data
          const nsInstance: INamespace = context.getContainer().get(ns.classRef);
          
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
            ns.events, 
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

    });
  }

  async onStart(context: HookContext) {
    function getComponent<T>(identifier: any) {
      return context.get<T>(identifier);
    }

    this.socketIOConfig.adapters.forEach(adapter => {
      if ((<any>adapter).getAdapter) {
        const adapterInstance = (<Adapter>adapter).getAdapter(getComponent);
        this.ioServer.adapter(adapterInstance);
      }
      else {
        this.ioServer.adapter(<NativeAdapter>adapter);
      }
    });

    if (!this.socketIOConfig.sharedServer) {
      this.ioServer.listen(3000);
    }
  }

  async onStop() {
    if (!this.socketIOConfig.sharedServer) {
      this.ioServer.close();
    }
  }
}