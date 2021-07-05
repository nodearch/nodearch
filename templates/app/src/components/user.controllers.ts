import { Controller } from "@nodearch/core";
import { HttpGet } from "@nodearch/express";
import { UserService } from './user.service';


@Controller()
export class UserController {

  constructor(public userService: UserService) {}

  @HttpGet('/users')
  getUsers() {
    return 'Hello, World!';
  }
}