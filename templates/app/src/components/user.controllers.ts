import { Controller } from "@nodearch/core";
import { Subscribe } from "@nodearch/socket.io";
import { HttpGet } from "@nodearch/express";


@Controller()
export class UserController {
  @HttpGet('/users')
  getUsers() {
    return 'Hello, World!';
  }

  @Subscribe('one')
  conn() {}
}