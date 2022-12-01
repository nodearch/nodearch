import { HttpBody, HttpController, HttpGet, HttpPath, HttpPost, HttpQuery, Middleware, UseMiddleware } from "@nodearch/express";
import { FirstMiddleware } from './middleware';
import { IUser } from './user.interface';
import { UserService } from './user.service';


@UseMiddleware(FirstMiddleware as any)
@HttpController()
export class UserController {

  @UseMiddleware(FirstMiddleware as any)
  @HttpGet('/')
  async getUsers() {
    return 'something';
  }

  // constructor(private readonly userService: UserService) {}

  // @HttpGet('/')
  // async getUsers(@HttpQuery() user?: Partial<IUser>) {
  //   return this.userService.getUsers(user);
  // }

  // @HttpGet('/:id')
  // async getUserById(@HttpPath('id') id: string) {
  //   return this.userService.getUsers({ id: parseInt(id) })[0];
  // }

  // @HttpPost('/')
  // async addUser(@HttpBody() user: Omit<IUser, 'id'>) {
  //   this.userService.addUser(user);
  //   return 'ok';
  // }

}
