import { Service } from '@nodearch/core';
import { NamespaceService } from './namespace.service';
import { SocketIOConfig } from './socketio.config';


@Service()
export class IO {
  
  constructor(
    private readonly socketIOConfig: SocketIOConfig,
    private readonly namespaceService: NamespaceService
  ) {}

  of(namespace: string) {
    /**
     * This is a fix due to a weird behavior in socket.io where
     * if the namespace doesn't exist, because it was supposed 
     * to be created by a dynamic namespace on first connection 
     * but we're trying to emit an event on that namespace before it's created
     * socket.io will create and reserve it in the memory, but that will be wrong because 
     * it will be missing any middleware/subscriptions' listeners.
     * Therefore, here we manually create the namespace and assign 
     * it all middleware and listeners from the dynamic namespace that matches .
     */
    if (!this.socketIOConfig.ioServer._nsps.has(namespace)) {
      const dynamicNamespace = this.namespaceService
        .getDynamicNamespace(namespace);
      
      // If a dynamic namespace match found, we use its listeners and middleware to register this namespace
      if (dynamicNamespace) {
        this.namespaceService.create({ ...dynamicNamespace, name: namespace });
      }
    }

    return this.socketIOConfig.ioServer.of(namespace);
  }

  get to() {
    return this.socketIOConfig.ioServer.to;
  }

  get emit() {
    return this.socketIOConfig.ioServer.emit;
  }
}