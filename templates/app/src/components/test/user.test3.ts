import { BeforeAll, Case, Test, TestBox, UseMock } from '@nodearch/core';
import { UserController } from '../user.controllers';
import { UserCtrlMock } from './user.mock';


@Test('test suite title')
@UseMock(UserCtrlMock)
export class UserTest3 {

  constructor(private testBox: TestBox, private userController: UserController) {}
  
  @Case()
  getUserDataWithId(params: any) {
    console.log('params', params);
    // console.log(this.userController);
  }

  // @Case('Should get userx 2')
  // getUser2() {
  //   // console.log(this.userController);
  // }
}