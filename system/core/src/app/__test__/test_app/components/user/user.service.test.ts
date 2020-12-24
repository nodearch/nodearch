import { Service } from "../../../../../components";
import { UserRepository } from "./user.repository.test";

@Service() 
export class UserService {
  constructor(private userRepository: UserRepository) {}

  getUsers = () => this.userRepository.getUsers();
  getUserById = (id: number) =>  this.userRepository.getUserById(id);
}