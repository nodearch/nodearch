import { ComponentScope, Test } from '@nodearch/core';
import assert from 'assert';
import { UserService } from './user.service';

@Test()
export class UserTest1 {
  constructor(private userService: UserService) {
    // this.userService.addUsers(10);
    // console.log('-UserTest1', this);
  }

  one() {
    this.userService.addUsers(10);
    const res = this.userService.getUsers();
    assert.strictEqual(res, 10);
  }
}