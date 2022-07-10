import { Case, Test, TestMode } from '@nodearch/core';
import { UserController } from './user.controller';
import { expect } from 'chai';

@Test({ mode: TestMode.E2E })
export class UserTest3 {
  constructor(private userController: UserController) {}

  @Case()
  public firstTest() {
    // expect(this.userController.one()).to.equal(2);
  }
}