import { ComponentType, Hook, HookContext, IHook, Logger } from '@nodearch/core';
import { SocketIOConfig } from './socketio.config';
import io from 'socket.io';
import { SocketIOService } from './socketio.service';
import { NativeAdapter } from '../interfaces';
import { Adapter } from '..';
import { NamespaceService } from './namespace.service';


@Hook()
export class SocketIOHook implements IHook {

  private socketIOConfig: SocketIOConfig;
  private socketIOService: SocketIOService;
  private ioServer: io.Server;
  private namespaceService: NamespaceService;

  constructor(
    socketIOService: SocketIOService, 
    socketIOConfig: SocketIOConfig, 
    namespaceService: NamespaceService
  ) {
    this.socketIOService = socketIOService;
    this.socketIOConfig = socketIOConfig;
    this.ioServer = socketIOConfig.ioServer;
    this.namespaceService = namespaceService;
  }

  async onInit(context: HookContext) {
    const controllers = context.getComponents(ComponentType.Controller);
    if (!controllers) return;

    const controllersMetadata = this.socketIOService.getControllersMetadata(controllers);
    const namespacesMetadata = this.socketIOService.getNamespacesMetadata(controllersMetadata);
    
    this.namespaceService.init(this.dependencyFactory(context));

    namespacesMetadata.forEach(ns => { this.namespaceService.create(ns) });
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

  private dependencyFactory(context: HookContext) {
    return (dependency: any) => {
      return context.get(dependency);
    }
  }
}