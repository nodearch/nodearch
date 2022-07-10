import { Repository } from "../../../../../components";

@Repository() 
export class UserRepository {
  getUsers = () => [{ id: 1, name: 'test' }];
  getUserById = (id: number) => ({ id: 1, name: 'test' });
}