import io from 'socket.io';

export interface ISocketIOOptions {
  ioServer: io.Server;
}

export interface IEventSubscribeMetadata {
  eventName: string;
  method: string;
}