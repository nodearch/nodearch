import { Controller } from "@nodearch/core";
import { Subscribe, Socket, SocketInfo, EventData, UseNamespace, IO } from "@nodearch/socket.io";
import { UserNamespace, UserNamespace2 } from './user.namespace';

@UseNamespace(UserNamespace)
@Controller()
export class UserController {

  constructor(private readonly io: IO) {}

  @Subscribe('one')
  async getOne(@EventData() data: any, @SocketInfo() socket: Socket) {
    console.log('UserController.One triggered!');
    console.log(socket.id);
    console.log(data);
    this.io
      .of('/userNamespace1')
      .emit('one', data);

    return data;
  }

  @UseNamespace(UserNamespace2)
  @Subscribe('one')
  getTwo(@EventData() data: any, @SocketInfo() socket: Socket) {
    console.log('[UserNamespace2] UserController.One triggered!');
    // console.log(socket.id);
    // console.log(data);
  }

  @Subscribe('three')
  getThree(@EventData() data: any, @SocketInfo() socket: Socket) {
    // console.log(socket.id);
    // console.log(data);
  }

}