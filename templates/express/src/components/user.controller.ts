import { HttpBody, HttpController, HttpGet, HttpPath, HttpPost, HttpQuery, Use } from "@nodearch/express";
import { ResponseObject } from '@nodearch/openapi';
import { FirstMiddleware } from './middleware.js';
import { IUser } from './user.interface.js';
import { UserService } from './user.service.js';

 
@Use(FirstMiddleware)
@HttpController()
export class UserController {

  constructor(private readonly userService: UserService) {}

  @ResponseObject({
    description: 'User response',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'number'
            },
            name: {
              type: 'string'
            }
          }
        }
      }
    }
  })
  @Use(FirstMiddleware)
  @HttpGet('/')
  async getUsers(@HttpQuery() user?: Partial<IUser>) {
    return this.userService.getUsers(user);
  }

  @HttpGet('/:id')
  async getUserById(@HttpPath('id') id: string) {
    return this.userService.getUsers({ id: parseInt(id) })[0];
  }

  @HttpPost('/')
  async addUser(@HttpBody() user: Omit<IUser, 'id'>) {
    this.userService.addUser(user);
    return 'ok';
  }

} 
