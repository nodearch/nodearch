import { Case, Test, TestMode } from '@nodearch/core';


@Test({ mode: TestMode.E2E })
export class UserTest3 {
  constructor() {}

  @Case()
  public firstTest() {
    // expect(this.userController.one()).to.equal(2);
  }
}