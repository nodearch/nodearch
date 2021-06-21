import { Test, TestCase } from '@nodearch/core';
import { UserService } from './user.service';
import assert from 'assert'
import util from 'util';

const sleep = util.promisify(setTimeout);

@Test({
  title: 'My second test suite'
})
export class UserTest2 {
  constructor(private userService: UserService) {
    // console.log('-UserTest2', this);
  }

  @TestCase('This is the first case in UserTest2')
  async one() {
    await sleep(1500);
    const res = this.userService.getUsers();
    assert.strictEqual(res, 0);
  }
}