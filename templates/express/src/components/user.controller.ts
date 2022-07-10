import { Controller } from "@nodearch/core";
import { BodyParam, HttpGet, HttpPath, HttpPost, PathParam, QueryParam } from "@nodearch/express";
import { IUser } from './user.interface';
import { UserService } from './user.service';


@HttpPath('/api/users')
@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {}

  @HttpGet('/')
  getUsers(@QueryParam() user?: Partial<IUser>) {
    return this.userService.getUsers(user);
  }

  @HttpGet('/:id')
  getUserById(@PathParam('id') id: string) {
    return this.userService.getUsers({ id: parseInt(id) })[0];
  }

  @HttpPost('/')
  addUser(@BodyParam() user: Omit<IUser, 'id'>) {
    this.userService.addUser(user);
    return 'ok';
  }

}