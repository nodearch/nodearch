import { Service } from '@nodearch/core';
import { IUser } from './user.interface.js';
import { UserRepository } from './user.repository.js';

@Service()
export class UserService {
  
  constructor(private readonly userRepository: UserRepository) {}
  
  getUsers(criteria?: Partial<IUser>) {
    return this.userRepository.getUsers(criteria);
  }

  addUser(user: Omit<IUser, 'id'>) {
    const newUserId = this.userRepository.getUsersCount() + 1;
    
    this.userRepository.addUser({
      ...user,
      id: newUserId    
    });
  }
}