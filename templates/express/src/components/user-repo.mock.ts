import { Mock } from '@nodearch/mocha';
import { UserRepository } from './user.repository.js';


@Mock(UserRepository)
export class UserRepoMock {
  async getUsers() {
    return [
      {
        id: 1000,
        name: 'Mocked User',
        email: 'mocked.user@email.com',
        age: 1,
        role: 'admin',
        language: 'en'
      },
    ];
  }
}