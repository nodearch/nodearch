import { Namespace, Socket } from '@nodearch/socket.io';
import { INamespace } from '@nodearch/socket.io';

@Namespace('/userNamespace1')
export class UserNamespace implements INamespace {

  async middleware(socket: Socket) {
    // console.log('from middleware', socket.id);
    // throw new Error('Unauthorized!');
  }

  onConnection(socket: Socket) {
    // console.log('from on connection', socket.id);
  }

  onDisconnect(socket: Socket) {
    // console.log('from on disconnection', socket.id);
  }
}

@Namespace(/^\/\w+$/)
export class UserNamespace2 implements INamespace {
  async middleware(socket: Socket) {
    console.log('this is from dynamic namespace', socket.nsp.name);
  }
}