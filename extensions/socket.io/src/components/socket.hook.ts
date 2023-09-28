import { Hook, Logger } from '@nodearch/core';
import { SocketService } from './socket.service.js';


@Hook()
export class SocketIOHook {

  constructor(
    private readonly logger: Logger,
    private readonly socketService: SocketService
  ) {}

  async onStart() {
    try {

      await this.socketService.start();
    }
    catch(error: any) {
      this.logger.error(error);
    }
  }
  
}