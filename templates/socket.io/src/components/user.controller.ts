import { Controller, Use } from '@nodearch/core';
import { Subscribe, Namespace, INamespace, INamespaceArgs } from '@nodearch/socket.io';


@Namespace('/user1')
export class UserNamespace implements INamespace {
  async handler(data: { args: INamespaceArgs; options: any; }) {}
}

@Controller()
@Use(UserNamespace)
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


  // @Namespace('/user2')
  @Subscribe('getUsers')
  createUser() {

  }
}