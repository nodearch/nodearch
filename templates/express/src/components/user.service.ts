import { Service } from '@nodearch/core';
import { IUser } from './user.interface';
import { UserRepository } from './user.repository';

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