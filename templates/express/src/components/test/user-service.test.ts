import { Case, Test, UseMock } from '@nodearch/core';
import { expect } from 'chai';
import { UserService } from '../user.service';
import { UserServiceMock } from './user-service.mock';

@UseMock(UserServiceMock)
@Test()
export class UserServiceTest {
  constructor(private readonly userService: UserService) {}

  @Case()
  public shouldReturnTwoRecords() {
    expect(this.userService.getUsers().length).to.equal(2);
  }
}