import { Controller } from '@nodearch/core';
import { LambdaHandler } from '@nodearch/lambda';

@Controller()
export class UserController {
  private users = [
    {
      id: "1",
      name: 'John Doe',
      email: 'john.doe@email.com'
    },
    {
      id: "2",
      name: 'Jane Doe',
      email: 'jane.doe@email.com'
    }
  ];

  @LambdaHandler('getUsers')
  async getUsers(event: any) {
    if (event) {
      return this.users.find(user => user.id === event);
    }
    return this.users;
  }
}