import { Service } from '@nodearch/core';
import { IUser } from './user.interface.js';
import { UserRepository } from './user.repository.js';


@Service()
export class UserService {
  
  constructor(private readonly userRepository: UserRepository) {}
  
  async getUsers(criteria?: Partial<IUser>) {
    return await this.userRepository.getUsers(criteria);
  }

  async addUser(user: Omit<IUser, 'id'>) {
    const newUserId = await this.userRepository.getUsersCount() + 1;
    
    await this.userRepository.addUser({
      ...user,
      id: newUserId    
    });
  }

  async getUserById(id: number) {
    const users = await this.userRepository.getUsers({ id });
    return users[0];
  }
}