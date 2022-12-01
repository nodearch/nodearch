import { Case, Service, Test, TestMode } from '@nodearch/core';


// @Test({ mode: TestMode.E2E })
@Service()
export class UserService2 {
  constructor() {}

  public firstTest() {
    // expect(this.userController.one()).to.equal(2);
  }
} 