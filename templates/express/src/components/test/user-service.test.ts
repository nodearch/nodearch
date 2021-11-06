import { Case, Component, Test, UseMock } from '@nodearch/core';
import { expect } from 'chai';
import { UserService } from '../user.service';
import { UserRepositoryMock } from './user-repository.mock';

@UseMock(UserRepositoryMock)
@Test()
export class UserServiceTest {
  constructor(private readonly userService: UserService) {}

  @Case()
  public shouldReturnTwoRecords() {
    expect(this.userService.getUsers().length).to.equal(3);
  }
}