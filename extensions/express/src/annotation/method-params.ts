import { RouteHandlerParam } from '../enums';
import { handlerParamFactory } from './helpers';



// TODO: add key to BodyParam
export const BodyParam = (): ParameterDecorator => handlerParamFactory(RouteHandlerParam.BODY);
export const PathParam = (key?: string): ParameterDecorator => handlerParamFactory(RouteHandlerParam.PARAMS, key);

/**
 * 
 * @param key property key to picked from the headers object.
 */
export const HeaderParam = (key?: string): ParameterDecorator => handlerParamFactory(RouteHandlerParam.HEADERS, key);

/**
 * This property is an object containing a property 
 * for each query string parameter in the route. 
 * When query parser is set to disabled, it is an empty object {}, 
 * otherwise it is the result of the configured query parser.
 * @param key property key to picked from the query object.
 */
export const QueryParam = (key?: string): ParameterDecorator => handlerParamFactory(RouteHandlerParam.QUERY, key);

/**
 * The req object represents the HTTP request and has properties 
 * for the request query string, parameters, body, HTTP headers, and so on.
 */
export const ReqParam = (): ParameterDecorator => handlerParamFactory(RouteHandlerParam.REQ);

/**
 * The res object represents the HTTP response that 
 * an Express app sends when it gets an HTTP request.
 */
export const ResParam = (): ParameterDecorator => handlerParamFactory(RouteHandlerParam.RES);
