export interface IUser {
  id: number;
  name: string;
  email: string;
  age: number;
  role: 'user' | 'admin';
}