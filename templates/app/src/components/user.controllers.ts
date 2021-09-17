import { Controller } from "@nodearch/core";
import { Subscribe, Socket, SocketInfo, EventData, UseNamespace } from "@nodearch/socket.io";
import { HttpGet } from "@nodearch/express";
import { UserNamespace, UserNamespace2 } from './user.namespace';


@UseNamespace(UserNamespace)
@Controller()
export class UserController {
  @HttpGet('/users')
  getUsers() {
    return 'Hello, World!';
  }

  @Subscribe('one')
  getOne(@EventData() data: any, @SocketInfo() socket: Socket) {
    console.log(socket.id);
    console.log(data);
  }

  @UseNamespace(UserNamespace2)
  @Subscribe('two')
  getTwo(@EventData() data: any, @SocketInfo() socket: Socket) {
    console.log(socket.id);
    console.log(data);
  }

  @Subscribe('three')
  getThree(@EventData() data: any, @SocketInfo() socket: Socket) {
    console.log(socket.id);
    console.log(data);
  }

}