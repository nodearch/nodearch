import { HttpMethod, RouteHandlerParam } from './enums.js';
import { handlerParamFactory, httpMethodFactory } from './helpers.js';

  
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

/**
 * Get an object containing the whole request payload 
 * or provide a valid path inside the object
 * @param path valid path in the request body/payload 
 */
export const HttpBody = (path?: string): ParameterDecorator => handlerParamFactory(RouteHandlerParam.BODY, path);

/**
* Get an object containing all path params or 
* provide the param name.
* @param name parameter name  
*/
export const HttpPath = (name?: string): ParameterDecorator => handlerParamFactory(RouteHandlerParam.PARAMS, name);

/**
* Get all the request headers or provide the header name.
* @param name header name
*/
export const HttpHeader = (name?: string): ParameterDecorator => handlerParamFactory(RouteHandlerParam.HEADERS, name);

/**
* Get an object containing parsed query params 
* or provide a specific query param name.  
* @param name query parameter name.
*/
export const HttpQuery = (name?: string): ParameterDecorator => handlerParamFactory(RouteHandlerParam.QUERY, name);

/**
* The req object represents the HTTP request and has properties 
* for the request query string, parameters, body, HTTP headers, and so on.
*/
export const HttpReq = (): ParameterDecorator => handlerParamFactory(RouteHandlerParam.REQ);

/**
* The res object represents the HTTP response that 
* an Express app sends when it gets an HTTP request.
*/
export const HttpRes = (): ParameterDecorator => handlerParamFactory(RouteHandlerParam.RES);