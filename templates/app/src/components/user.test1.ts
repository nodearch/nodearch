import { Test, TestCase } from '@nodearch/core';
import assert from 'assert';
import { UserService } from './user.service';

@Test({
  title: 'My first test suite'
})
export class UserTest1 {
  constructor(private userService: UserService) {
    // this.userService.addUsers(10);
    // console.log('-UserTest1', this);
  }

  // TODO: do we need to pass options instead of title?
  // TODO: should we rename the decorator to @Case instead?
  @TestCase('This is the #1 case in UserTest1')
  onex() {
    this.userService.addUsers(10);
    const res = this.userService.getUsers();
    assert.strictEqual(res, 10);
  }

  @TestCase('This is the #2 case in UserTest1')
  oneY() {
    const res = this.userService.getUsers();
    assert.strictEqual(res, 10);
  }
}