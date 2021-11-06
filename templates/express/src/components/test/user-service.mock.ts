import { IMock, Mock } from '@nodearch/core';
import { UserRepository } from '../user.repository';

@Mock()
export class UserServiceMock implements IMock{
  override = [
    {
      component: UserRepository,
      use: {
        getUsers: () => {
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
            }
          ];
        },
      
        addUser: () => {},
      
        getUsersCount: () => {
          return 2;
        }
      }
    }
  ];
}