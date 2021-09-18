import { ComponentType, Hook, HookContext, IHook, Logger } from '@nodearch/core';
import { SocketIOConfig } from './socketio.config';
import io from 'socket.io';
import { MetadataManager } from '../metadata';
import { SocketIOService } from './socketio.service';


@Hook()
export class SocketIOHook implements IHook {

  private socketIOService: SocketIOService;
  private ioServer: io.Server;
  private logger: Logger;


  constructor(socketIOService: SocketIOService, socketIOConfig: SocketIOConfig, logger: Logger) {
    this.socketIOService = socketIOService;
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

      this
        .ioServer
        .of(ns.metadata.name)
        .use((socket, next) => { 
          // get the namespace instance with every new connection and pass it via data
          const nsInstance = context.getContainer().get(ns.classRef);
          
          socket.data.nodearch = {
            nsInstance
          };

          // TODO: run middleware here

          next(); 
        })
        .on('connection', (socket) => {
          this.logger.debug(`New socket connected: ${socket.id}`);

          this.socketIOService.registerEvents(
            socket, 
            ns.events, 
            nsControllers, 
            socket.data.nodearch.nsInstance
          );

          // TODO: call onConnection and onDisconnect hooks manually for the namespace

          socket.on('disconnect', () => {
            this.logger.debug(`Socket disconnected: ${socket.id}`);
          });
        });

    });
  }

  async onStart() {}
}