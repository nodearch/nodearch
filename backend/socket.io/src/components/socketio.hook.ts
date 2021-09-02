import { ComponentType, Hook, HookContext, IHook, Logger } from '@nodearch/core';
import { SocketIOConfig } from './socketio.config';
import io from 'socket.io';
import { ControllerMetadata } from '../metadata';


@Hook()
export class SocketIOHook implements IHook {

  private logger: Logger;
  private config: SocketIOConfig;
  private ioServer: io.Server;

  constructor(config: SocketIOConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.ioServer = config.ioServer;
  }

  async onInit(context: HookContext) {
    console.log('SocketIOHook onInit');

    const controllers = context.getComponents(ComponentType.Controller);
    console.log('controllers', controllers);
    controllers?.forEach(ctrl => {
      const subs = ControllerMetadata.getSubscribes(ctrl);
      console.log(subs);
    });

  }

  async onStart() {
    this.ioServer.on('connection', (socket) => {
      this.logger.info(`New socket connected: ${socket.id}`);      
    });
  }
}