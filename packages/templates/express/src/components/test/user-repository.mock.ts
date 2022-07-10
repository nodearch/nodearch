import { Mock } from '@nodearch/core';
import { UserRepository } from '../user.repository';

@Mock(UserRepository)
export class UserRepositoryMock {
  getUsers() {
    return [
      {
        id: 1,
        name: 'Name #1',
        email: 'name.1@email.com',
        age: 1,
        role: 'admin'
      },
      {
        id: 2,
        name: 'Name #2',
        email: 'name.2@email.com',
        age: 2,
        role: 'user'
      },
      {
        id: 3,
        name: 'Name #3',
        email: 'name.3@email.com',
        age: 3,
        role: 'user'
      }
    ];
  }

  addUser() {}

  getUsersCount() {
    return 2;
  }
}