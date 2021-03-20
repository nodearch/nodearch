export class DependencyException extends Error {
  code: string; 
  data?: any;

  constructor(message: string, data?: any) {
    super(message);
    this.code = 'DEPENDENCY_EXCEPTION';
    this.data = data;
  }
}