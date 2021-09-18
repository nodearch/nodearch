import { Namespace, Socket } from '@nodearch/socket.io';
import { INamespace } from '@nodearch/socket.io/dist/interfaces';

@Namespace('/userNamespace1')
export class UserNamespace implements INamespace {
  
  async middleware(socket: Socket) {
    // console.log('from middleware', socket.id);
  }

  onConnection(socket: Socket) {
    // console.log('from on connection', socket.id);
  }

  onDisconnect(socket: Socket) {
    // console.log('from on disconnection', socket.id);
  }
}

@Namespace('/')
export class UserNamespace2 implements INamespace {
  async middleware(socket: Socket) {
    console.log('from middleware on /');
  }
}