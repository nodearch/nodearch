import { RouteHandlerParam } from './enums';
import { handlerParamFactory } from './helpers';


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
