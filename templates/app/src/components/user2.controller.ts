import { Controller } from "@nodearch/core";
import { Subscribe, Socket, SocketInfo, EventData, UseNamespace } from "@nodearch/socket.io";
import { HttpGet } from "@nodearch/express";
import { UserNamespace, UserNamespace2 } from './user.namespace';


@UseNamespace(UserNamespace)
@Controller()
export class UserController2 {
  @HttpGet('/users')
  getUsers() {
    return 'Hello, World!';
  }

  @Subscribe('onex')
  getOne(@EventData() data: any, @SocketInfo() socket: Socket) {
    // console.log(socket.id);
    // console.log(data);
  }

  @Subscribe('twox')
  getTwo(@EventData() data: any, @SocketInfo() socket: Socket) {
    // console.log(socket.id);
    // console.log(data);
  }

  @Subscribe('threex')
  getThree(@EventData() data: any, @SocketInfo() socket: Socket) {
    // console.log(socket.id);
    // console.log(data);
  }

}