import { Case, Test, BeforeAll, TestBox, BeforeEach, AfterEach } from '@nodearch/core';
import { UserController } from './user.controller';
import { expect } from 'chai';

@Test()
export class UserTest {
  constructor(private testBox: TestBox, private userController: UserController) {}

  @BeforeEach()
  beforeEach() {
    // this.testBox.snapshot();
  }

  @AfterEach()
  afterEach() {
    // this.testBox.restore();
  }

  @Case('#1', { params: { counter: 1 } })
  @Case('#2', { params: { counter: 2 } })
  @Case('#3', { params: { counter: 3 } })
  @Case({ params: { counter: 4 } })
  @Case({ params: { counter: 5 } })
  public shouldReturnMockOfPrint({ counter }: { counter: number }) {
    const x = this.testBox
      .mock({ component: UserController, use: { res: `mocked controller #${counter}` } })
      .get(UserController);
    
    expect(x).to.deep.equal({ res: `mocked controller #${counter}` });
  }
}