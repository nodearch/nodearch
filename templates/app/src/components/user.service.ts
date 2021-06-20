import { Service } from '@nodearch/core';


@Service()
export class UserService {
  
  private users: number;

  constructor() {
    this.users = 0;
  }

  addUsers(num: number) {
    this.users += num;
  }

  getUsers() {
    return this.users;
  }
}