import { AppContext, Hook, IHook, Logger } from '@nodearch/core';
import { SocketIOAdminUIConfig } from './socket-admin.config.js';
import { instrument } from '@socket.io/admin-ui';


@Hook({ export: true })
export class SocketAdminHook implements IHook {
  
  constructor(
    private readonly appContext: AppContext,
    private readonly config: SocketIOAdminUIConfig,
    private readonly logger: Logger
  ) {}

  async onStart() {
    if (!this.config.enable) return;

    const serverProvider = this.appContext.getContainer().get(this.config.server);
  
    if (!serverProvider) throw new Error('Socket.IO Server Provider not found. Admin UI cannot be started.');

    this.logger.info('Enabling Socket.IO Admin UI');

    const io = serverProvider.get();
    
    instrument(io, this.config.options);
  }
}