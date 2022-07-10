import { ControllerMetadata } from '../metadata';
import { getRouterPrefix } from './helpers';


/**
 * Class Decorator to prefix all HTTP methods in a Controller with express compatible HTTP path.
 * @param path
 *  The path can be any of:
 *    - A string representing a path.
 *    - A path pattern.
 *    - A regular expression pattern to match paths.
 *    - An array of combinations of any of the above.
 *    - examples: https://expressjs.com/en/4x/api.html#path-examples.
 */
 export function HttpPath(path: string): ClassDecorator {
  return function(target: object) {
    ControllerMetadata.setHttpPrefix(target, getRouterPrefix(path));
  };
}