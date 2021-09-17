import { ComponentType, Container, Hook, HookContext, IHook, Logger } from '@nodearch/core';
import { SocketIOConfig } from './socketio.config';
import io from 'socket.io';
import { MetadataManager } from '../metadata';
import { SocketIOService } from './socketio.service';
import { ISocketIOController } from '../interfaces';


@Hook()
export class SocketIOHook implements IHook {

  private controllersBindKey: string;
  private socketIOService: SocketIOService;
  private socketIOConfig: SocketIOConfig;
  private ioServer: io.Server;
  private logger: Logger;
  private container?: Container;
  private socketIOControllers: ISocketIOController[];

  constructor(socketIOService: SocketIOService, socketIOConfig: SocketIOConfig, logger: Logger) {
    this.controllersBindKey = 'socket.io/controllers';
    this.socketIOService = socketIOService;
    this.socketIOConfig = socketIOConfig;
    this.ioServer = socketIOConfig.ioServer;
    this.logger = logger;
    this.socketIOControllers = [];
  }

  async onInit(context: HookContext) {
    const controllers = context.getComponents(ComponentType.Controller);

    if (!controllers) return;

    const socketIOControllers = this.socketIOService.filterSocketIOControllers(controllers);
    
    if (!socketIOControllers.length) return;

    const container = context.getContainer().createChild({
      defaultScope: 'Request'
    });

    socketIOControllers.forEach(ctrlInfo => {
      container.bind(this.controllersBindKey).to(ctrlInfo.controller);
    });

    this.container = container;
    this.socketIOControllers = socketIOControllers;
  }

  async onStart() {
    if (this.container && this.socketIOControllers.length) {
      this.socketIOService.registerEvents(
        this.socketIOControllers, 
        () => {
          /**
           * The following should always return controllers
           * because we made sure we have a container instance
           * and bounded controllers before reaching this point
           */
          return this.container!.getAll<Record<string, Object>>(this.controllersBindKey);
        }
      );
    }


    // this.ioServer.on('connection', (socket) => {
    //   this.logger.info(`New socket connected: ${socket.id}`);
      
    //   if (this.container && this.socketIOControllers.length) {
    //     const controllers = this.container.getAll<any>(this.controllersBindKey);

    //     this.socketIOControllers.forEach(ctrlInfo => {
          
    //       const controller = controllers.find(ctrl => {
    //         return ctrl.constructor === ctrlInfo.controller;
    //       }); 

    //       ctrlInfo.events.forEach(event => {
    //         socket.on(event.eventName, (data) => {
    //           // TODO: do it dynamically
    //           controller[event.method](socket, data);
    //         });
    //       });
    //     });
    //   }

    // });
  }
}