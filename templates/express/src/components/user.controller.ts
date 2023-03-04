import { HttpBody, HttpController, HttpGet, HttpPath, HttpPost, HttpQuery, Use } from "@nodearch/express";
import { Responses, Servers, Tags } from '@nodearch/openapi';
import { FirstMiddleware } from './middleware.js';
import { IUser } from './user.interface.js';
import { UserService } from './user.service.js';

@Servers([
  {
    url: 'http://localhost:3000',
    description: 'Local server'
  },
  {
    url: 'http://localhost:3001',
    description: 'Local server'
  }
])
@Use(FirstMiddleware)
@HttpController()
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Responses({
    default: {
      description: 'Default response'
    },
    '200': {
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
    }
  })
  @Use(FirstMiddleware)
  @HttpGet('/')
  async getUsers(@HttpQuery() user?: Partial<IUser>) {
    return this.userService.getUsers(user);
  }

  @Tags([
    'Dev',
    "Bus"
  ])
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
