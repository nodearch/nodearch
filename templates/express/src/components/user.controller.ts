import { HttpBody, HttpController, HttpGet, HttpPath, HttpPost, HttpQuery, Middleware, UseMiddleware } from "@nodearch/express";
import { IUser } from './user.interface';
import { UserService } from './user.service';

@Middleware()
export class FirstMiddleware {}


@HttpController()
export class UserController {

  constructor(private readonly userService: UserService) {}

  @UseMiddleware((req, res, next) => { console.log(); next(); })
  @UseMiddleware(FirstMiddleware as any)
  @HttpGet('/')
  getUsers(@HttpQuery() user?: Partial<IUser>) {
    return this.userService.getUsers(user);
  }

  @HttpGet('/:id')
  getUserById(@HttpPath('id') id: string) {
    return this.userService.getUsers({ id: parseInt(id) })[0];
  }

  @HttpPost('/')
  addUser(@HttpBody() user: Omit<IUser, 'id'>) {
    this.userService.addUser(user);
    return 'ok';
  }

}
