import { Test, Case, BeforeEach, AfterAll } from '@nodearch/core';
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

  @BeforeEach('sssssss')
  async wait() {
    await sleep(1000);
  }

  @AfterAll('sssssss')
  async end() {
    await sleep(1000);
  }

  @Case('This is the first case in UserTest2', false)
  async one() {
    // await sleep(1500);
    const res = this.userService.getUsers();
    assert.strictEqual(res, 0);
  }

  @Case('This is the first case in UserTest3', true)
  async one2() {
    // await sleep(1500);
    // const res = this.userService.getUsers();
    // assert.strictEqual(res, 0);
  }

  @Case('This is the first case in UserTest4', false)
  async one3() {
    // await sleep(1500);
    // const res = this.userService.getUsers();
    // assert.strictEqual(res, 0);
  }
}