import { Repository } from '@nodearch/core';
import { IUser } from './user.interface.js';

@Repository()
export class UserRepository {
  
  private users: IUser[];

  constructor() {
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@email.com',
        age: 30,
        role: 'admin',
        language: 'en'
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@email.com',
        age: 25,
        role: 'user',
        language: 'fr'
      }
    ];
  }

  getUsers(criteria?: Partial<IUser>) {
    if (!criteria || !Object.keys(criteria).length) {
      return this.users;
    }

    return this.users.filter(user => {
      return Object.keys(criteria).every(key => user[key as keyof IUser] === criteria[key as keyof IUser]);
    });
  }

  addUser(user: IUser) {
    this.users.push(user);
  }

  getUsersCount() {
    return this.users.length;
  }
}