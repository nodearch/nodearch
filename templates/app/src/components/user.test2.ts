import { Test } from '@nodearch/core';
import { UserService } from './user.service';
import assert from 'assert'

@Test()
export class UserTest2 {
  constructor(private userService: UserService) {
    // console.log('-UserTest2', this);
  }

  one() {
    const res = this.userService.getUsers();
    assert.strictEqual(res, 0);
  }
}