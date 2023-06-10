// import { isAsyncFunction } from 'node:util/types';
// import { IBinderBindOptions } from './interfaces.js';

// // TODO: move this to the container and pass ComponentInfo to the container, hide the proxy stuff.
// export class ComponentBinder {
//   static bindComponent({
//     componentClass,
//     container,
//     id, scope,
//     namespace
//   }: IBinderBindOptions) {
//     container.bindComponent(componentClass, scope)

//     .proxy({
//       get: function(target: any, propKey: string) {
//         const originalMethod = target[propKey];

//         if (typeof originalMethod === 'function' && propKey !== 'constructor') {
//           if (isAsyncFunction(originalMethod)) {
//             return async function (...args: any) {
//               let result, state = true;
  
//               if (state) {
//                 result = await originalMethod.apply(target, args);
//               }
  
//               return result;
//             }
//           }
//           else {
//             return function (...args: any) {
//               let result, state = true;
  
//               if (state) {
//                 result = originalMethod.apply(target, args);
//               }
  
//               return result;
//             }
//           }
//         }
//         else {
//           return originalMethod;
//         }
//       }
//     });

//     container.addToComponentGroup(componentClass, id);

//     if (namespace && namespace !== id) {
//       container.addToNamespace(componentClass, namespace);
//     }
//   }
// }