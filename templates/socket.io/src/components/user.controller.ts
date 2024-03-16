import { Controller, Use } from '@nodearch/core';
import { Subscribe, NamespaceProvider, INamespaceArgs, INamespace, Namespace } from '@nodearch/socket.io';

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
  createUser() {
    // console.log('createUser');
  }
}