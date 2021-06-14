import { HttpMethod } from '../enums';
import { httpMethodFactory } from './helpers';

/**
 * Method Decorator to route HTTP GET requests to the specified path.
 * @param path
 *  The path for which the controller method is invoked. can be any of:
 *    - A string representing a path.
 *    - A path pattern.
 *    - A regular expression pattern to match paths.
 *    - An array of combinations of any of the above.
 *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
 */
 export const HttpGet = (path?: string): MethodDecorator => httpMethodFactory(HttpMethod.GET, path);


 /**
  * Method Decorator to route HTTP HEAD requests to the specified path.
  * @param path
  *  The path for which the controller method is invoked. can be any of:
  *    - A string representing a path.
  *    - A path pattern.
  *    - A regular expression pattern to match paths.
  *    - An array of combinations of any of the above.
  *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
  */
 export const HttpHead = (path?: string): MethodDecorator => httpMethodFactory(HttpMethod.HEAD, path);
 
 
 /**
  * Method Decorator to route HTTP POST requests to the specified path.
  * @param path
  *  The path for which the controller method is invoked. can be any of:
  *    - A string representing a path.
  *    - A path pattern.
  *    - A regular expression pattern to match paths.
  *    - An array of combinations of any of the above.
  *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
  */
 export const HttpPost = (path?: string): MethodDecorator => httpMethodFactory(HttpMethod.POST, path);
 
 
 /**
  * Method Decorator to route HTTP PUT requests to the specified path.
  * @param path
  *  The path for which the controller method is invoked. can be any of:
  *    - A string representing a path.
  *    - A path pattern.
  *    - A regular expression pattern to match paths.
  *    - An array of combinations of any of the above.
  *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
  */
 export const HttpPut = (path?: string): MethodDecorator => httpMethodFactory(HttpMethod.PUT, path);
 
 
 /**
  * Method Decorator to route HTTP PATCH requests to the specified path.
  * @param path
  *  The path for which the controller method is invoked. can be any of:
  *    - A string representing a path.
  *    - A path pattern.
  *    - A regular expression pattern to match paths.
  *    - An array of combinations of any of the above.
  *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
  */
 export const HttpPatch = (path?: string): MethodDecorator => httpMethodFactory(HttpMethod.PATCH, path);
 
 /**
  * Method Decorator to route HTTP DELETE requests to the specified path.
  * @param path
  *  The path for which the controller method is invoked. can be any of:
  *    - A string representing a path.
  *    - A path pattern.
  *    - A regular expression pattern to match paths.
  *    - An array of combinations of any of the above.
  *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
  */
 export const HttpDelete = (path?: string): MethodDecorator => httpMethodFactory(HttpMethod.DELETE, path);
 
 
 /**
  * Method Decorator to route HTTP OPTIONS requests to the specified path.
  * @param path
  *  The path for which the controller method is invoked. can be any of:
  *    - A string representing a path.
  *    - A path pattern.
  *    - A regular expression pattern to match paths.
  *    - An array of combinations of any of the above.
  *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
  */
 export const HttpOptions = (path?: string): MethodDecorator => httpMethodFactory(HttpMethod.OPTIONS, path);