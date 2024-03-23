import { ISocketIOServerProvider } from '@nodearch/socket.io';
import { instrument } from '@socket.io/admin-ui';

export interface SocketIOAdminUIOptions {
  serverProvider: ISocketIOServerProvider;
  options?: AdminUIOptions;
  enable?: boolean;
  serve?: boolean;
  url?: string;
}

export type AdminUIOptions = Parameters<typeof instrument>[1];