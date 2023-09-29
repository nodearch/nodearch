import { Controller, Use } from '@nodearch/core';
import { Subscribe, Namespace, INamespaceArgs } from '@nodearch/socket.io';


@Controller()
@Namespace('/user1')
// @Use(UserNamespace)
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