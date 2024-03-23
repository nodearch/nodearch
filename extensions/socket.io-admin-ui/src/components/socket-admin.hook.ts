import { AppContext, Hook, IHook, Logger } from '@nodearch/core';
import { SocketIOAdminUIConfig } from './socket-admin.config.js';
import { instrument } from '@socket.io/admin-ui';
import handler from 'serve-handler';
import { getUiUrl } from '../ui.js';
import { fileURLToPath } from 'node:url';


@Hook({ export: true })
export class SocketAdminHook implements IHook {
  
  constructor(
    private readonly appContext: AppContext,
    private readonly config: SocketIOAdminUIConfig,
    private readonly logger: Logger
  ) {}

  async onStart() {
    if (!this.config.enable) return;

    const serverProvider = this.appContext.getContainer().get(this.config.serverProvider);
  
    if (!serverProvider) throw new Error('Socket.IO Server Provider not found. Admin UI cannot be started.');

    this.logger.info('Starting Socket.IO Admin UI');

    const io = serverProvider.get();
    
    instrument(io, this.config.options);

    if (!this.config.serve) return;

    const httpServer = serverProvider.getHttpServer();

    httpServer.prependListener('request', (req, res) => {
      // TODO: Fix this (use express ext to serving, and pass it to socket.io)
      if (req.url?.startsWith(this.config.url)) {
        return handler(req, res, {
          public: fileURLToPath(getUiUrl()),
          rewrites: [
            { source: this.config.url, destination: '/index.html' }
          ]
        });
      }
    });

    this.logger.info(`Socket.IO Admin UI is available on ${this.config.url}`);
  }
}