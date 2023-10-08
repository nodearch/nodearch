import { Case, Override, Test } from '@nodearch/mocha';
import { UserService } from './user.service.js';
import { expect } from 'chai';
import { UserRepoMock } from './user-repo.mock.js';


@Test()
@Override(UserRepoMock)
export class UserTest {
  
  constructor(
    private userService: UserService,
  ) {}

  @Case()
  async getUsers() {
    const users = await this.userService.getUsers();
    expect(users).length(1);
    expect(users[0].name).to.be.equal('Mocked User'); // The value is from UserRepoMock
  }

}