import { Controller } from "@nodearch/core";
import { HttpGet } from "@nodearch/express";


@Controller()
export class UserController {

  @HttpGet('/users')
  getUsers() {
    return 'Hello, World!';
  }

}