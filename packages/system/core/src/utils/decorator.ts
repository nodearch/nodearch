export abstract class ClassDecoratorFactory {
  static requiredParams<T>(fn: (target: Function, options: T) => void) {
    return function (options: T): ClassDecorator {
      return function (target: Function) {
        fn(target, options);
      };
    };
  }

  static noParams(fn: (target: Function) => void): ClassDecorator {
    return function (target: Function) {
      fn(target);
    };
  }

  static optionalParams<T>(fn: (target: Function, options?: T) => void) {
    function decorator(target: Function): void;
    function decorator(options: T): ClassDecorator;
    function decorator(args?: any) {
      if (typeof args === 'function') {
        // class decorator
        fn(args);
      }
      else {
        // class decorator factory
        return function (target: Function) {
          fn(target, args);
        }
      }
    }

    return decorator;
  }
}

/**
 * Decorator that can apply to a Class constructor as well as Class Methods
 */
export type ClassMethodDecorator = (target: Function | object, propertyKey?: string) => void;

// export abstract class MethodDecoratorFactory {
//   static requiredParams<T>(fn: (target: any, propertyKey: string | symbol, options: T) => void) {
//     return function (options: T): MethodDecorator {
//       return function (target: any, propertyKey: string | symbol) {
//         fn(target, propertyKey, options);
//       };
//     };
//   }

//   static noParams(fn: (target: any, propertyKey: string | symbol) => void): MethodDecorator {
//     return function (target: any, propertyKey: string | symbol) {
//       fn(target, propertyKey);
//     };
//   }

//   static optionalParams<T>(fn: (target: any, propertyKey: string | symbol, options?: T) => void) {
//     function decorator(target: any, propertyKey: string | symbol): void;
//     function decorator(options: T): MethodDecorator;
//     function decorator(args: any, propertyKey: string | symbol) {
//       if (typeof args === 'function') {
//         // class decorator
//         fn(args, propertyKey);
//       }
//       else {
//         // class decorator factory
//         return function (target: any, propertyKey: string | symbol) {
//           fn(target, propertyKey, args);
//         }
//       }
//     }

//     return decorator;
//   }
// }