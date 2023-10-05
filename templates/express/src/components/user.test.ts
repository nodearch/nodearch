import { BeforeEach, Case, Test } from '@nodearch/mocha';
import { UserService } from './user.service.js';
import { expect } from 'chai';
import { IUser } from './user.interface.js';
import { UserRepository } from './user.repository.js';


@Test()
export class UserTest {
  
  constructor(
    private userService: UserService,
    private userRepository: UserRepository
  ) {}

  @BeforeEach()
  cleanupData() {
    this.userRepository.removeAll();
    this.userRepository.addUser({
      id: 1,
      name: 'John Doe',
      email: 'john.d@email.com',
      age: 20,
      role: 'admin',
      language: 'en'
    });
  }

  @Case()
  async getUsers() {
    const users = await this.userService.getUsers();
    expect(users).length(1);
    expect(users[0].name).to.be.equal('John Doe');
  }

  @Case()
  async addUser() {
    const data: Omit<IUser, "id">  = {
      name: 'Jane Doe', 
      email: 'jane.d@email.com',
      age: 20,
      role: 'admin',
      language: 'fr' 
    };

    await this.userService.addUser(data);

    expect(await this.userRepository.getUsersCount()).to.be.equal(2);
  }

  @Case('Get User by existing Id', {params: { id: 1 }})
  @Case('Get User by non-existing Id', {params: { id: 2 }})
  async getUserById({ id }: { id: number }) {
    const user = await this.userService.getUserById(id);
    
    if (id === 1) {
      expect(user.name).to.be.equal('John Doe');
    }
    else if (id === 2) {
      expect(user).to.be.undefined;
    }
  }

}