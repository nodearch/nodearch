import { HttpBody, HttpController, HttpGet, HttpPath, HttpPost, HttpQuery, Use } from "@nodearch/express";
import { Validate, JoiBuilder, JoiSchema } from '@nodearch/joi';
import { RequestBody, Responses, RouteInfo, Servers, Tags } from '@nodearch/openapi';
import { FirstMiddleware } from './middleware.js';
import { IUser } from './user.interface.js';
import { UserService } from './user.service.js';


@Tags(['User Management'])
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

  private one = 1;

  constructor(private readonly userService: UserService) {}

  @Validate({ input: { username: JoiBuilder.string().required().min(10) } })
  @HttpGet('/test')
  async test(@HttpQuery('username') username: string) {
    console.log('Test Called', username);
    return `Test Called with username: ${username} #${this.one++}`;
  }

  @Responses({
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


  @RouteInfo({
    tags: ['Special Tag'],
    requestBody: {
      description: 'User request body',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'User name',
                example: 'John Doe'
              }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'User response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                something: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  })
  @HttpGet('/:id')
  async getUserById(@HttpPath('id') id: string) {
    return this.userService.getUsers({ id: parseInt(id) })[0];
  }

  @RequestBody({
    description: 'User request body',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'User name',
              example: 'John Doe'
            }
          }
        }
      }
    }
  })
  @HttpPost('/')
  async addUser(@HttpBody() user: Omit<IUser, 'id'>) {
    this.userService.addUser(user);
    return 'ok';
  }

} 
