import { ISocketIOServerProvider } from '@nodearch/socket.io';
import { instrument } from '@socket.io/admin-ui';

export interface SocketIOAdminUIOptions {
  serverProvider: ISocketIOServerProvider;
  options?: AdminUIOptions;
  enable?: boolean;
}

export type AdminUIOptions = Parameters<typeof instrument>[1];