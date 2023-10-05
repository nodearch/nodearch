import { Controller, Use } from '@nodearch/core';
import { HttpBody, HttpGet, HttpParam, HttpPath, HttpPost, HttpQuery } from "@nodearch/express";
import { ValidationMiddleware } from '@nodearch/joi-express';
import { Tags } from '@nodearch/openapi';
import { UserMiddleware } from './user.middleware.js';
import { IUser } from './user.interface.js';
import { UserService } from './user.service.js';
import { createUserValidation } from './user-inputs.validation.js';


@Controller()
@Tags(['User Management'])
@Use(UserMiddleware)
@HttpPath('users')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @HttpGet('/')
  async getUsers(@HttpQuery() user?: Partial<IUser>) {
    return await this.userService.getUsers(user);
  }

  @HttpGet('/:id')
  async getUserById(@HttpParam('id') id: string) {
    return (await this.userService.getUsers({ id: parseInt(id) }))[0] || {};
  }

  @HttpPost('/')
  @Use(ValidationMiddleware, createUserValidation)
  async addUser(@HttpBody() user: Omit<IUser, 'id'>) {
    await this.userService.addUser(user);
    return 'ok';
  }

} 
