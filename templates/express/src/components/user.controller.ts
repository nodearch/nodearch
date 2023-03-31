import { Controller } from '@nodearch/core';
import { HttpBody, HttpGet, HttpPath, HttpPost, HttpQuery, Use } from "@nodearch/express";
import { Validate } from '@nodearch/joi-express';
import { RequestBody, Responses, RouteInfo, Servers, Tags } from '@nodearch/openapi';
import { FirstMiddleware } from './middleware.js';
import { IUser } from './user.interface.js';
import { UserService } from './user.service.js';
import Joi from 'joi';


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
@Controller()
export class UserController {

  private one = 1;

  constructor(private readonly userService: UserService) {}

  @Use((req, res, next) => {
    console.log('Middleware 1');
    next();
  })
  @Validate(Joi.object({ username: Joi.string().required().min(10) }))
  @Use((req, res, next) => {
    console.log('Middleware 2');
    next();
  })
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
