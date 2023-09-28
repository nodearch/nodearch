import { AppContext, Hook, IHook } from '@nodearch/core';
import { SocketIOAdminUIConfig } from './socket-admin.config.js';
import { instrument } from '@socket.io/admin-ui';


@Hook()
export class SocketAdminHook implements IHook {
  
  constructor(
    private readonly appContext: AppContext,
    private readonly config: SocketIOAdminUIConfig
  ) {}

  async onStart() {
    const serverProvider = this.appContext.getContainer().get(this.config.serverProvider);
  
    if (!serverProvider) throw new Error('Socket.IO Server Provider not found. Admin UI cannot be started.');

    const io = serverProvider.getServer();
  
    instrument(io, this.config.options);
  }
}