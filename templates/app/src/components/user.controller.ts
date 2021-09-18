import { Controller } from "@nodearch/core";
import { Subscribe, Socket, SocketInfo, EventData, UseNamespace, IO } from "@nodearch/socket.io";
import { HttpGet } from "@nodearch/express";
import { UserNamespace, UserNamespace2 } from './user.namespace';


@UseNamespace(UserNamespace)
@Controller()
export class UserController {

  constructor(private readonly io: IO) {}

  @HttpGet('/users')
  getUsers() {
    return 'Hello, World!';
  }

  @Subscribe('one')
  getOne(@EventData() data: any, @SocketInfo() socket: Socket) {
    console.log('UserController.One triggered!');
    console.log(socket.id);
    console.log(data);
    this.io.server
      .of('/userNamespace1')
      .emit('one', 'asdsadasdasdasd');
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