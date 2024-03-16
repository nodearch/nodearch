import { Controller, Use } from '@nodearch/core';
import { Subscribe, NamespaceProvider, INamespaceArgs, INamespace, Namespace, SocketInfo, EventData } from '@nodearch/socket.io';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@NamespaceProvider('/user1')
export class UserNamespace implements INamespace {
  async handler(data: { args: INamespaceArgs; options: any; }) {}
}

// TODO: test request scope with sockets by adding context class.
@Controller()
export class UserController {
  
  private users: any[];

  constructor() {
    this.users = [
      {
        id: 1,
        name: 'John Doe'
      },
      {
        id: 2,
        name: 'Jane Doe'
      }
    ];
  }
  
  // @Namespace(UserNamespace)
  @Subscribe('message2')
  createUser2() {
    // console.log('createUser2');
  }

  @Namespace(UserNamespace)
  @Subscribe('message')
  async createUser(h: any, @SocketInfo() socket: any, num: number, num1: number, num2: number, @EventData() data: any, num4: number) {
    console.log('createUser', socket?.id);
    console.log('createUser', data);

    return 'Hello from Server';
  }
}