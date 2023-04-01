import { Service } from '@nodearch/core';
import { IUser } from './user.interface.js';
import { UserRepository } from './user.repository.js';
import { Validate } from '@nodearch/joi';
import Joi from 'joi';

@Service()
export class UserService {
  
  constructor(private readonly userRepository: UserRepository) {}
  
  getUsers(criteria?: Partial<IUser>) {
    return this.userRepository.getUsers(criteria);
  }

  @Validate({ input: { name: Joi.string().required() } })
  async addUser(user: Omit<IUser, 'id'>) {
    const newUserId = this.userRepository.getUsersCount() + 1;
    
    this.userRepository.addUser({
      ...user,
      id: newUserId    
    });
  }
}