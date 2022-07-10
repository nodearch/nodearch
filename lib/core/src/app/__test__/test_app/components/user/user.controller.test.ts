import { Controller } from "../../../../../components";
import { UserService } from "./user.service.test";

@Controller() 
export class UserController {
  constructor(private userService: UserService) {}

  getUsers = () => this.userService.getUsers();
  getUserById = (id: number) =>  this.userService.getUserById(id);
}