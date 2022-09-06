import { ControllerMetadata } from '../controller';
import { IInterceptorMetadataInfo, IInterceptor, IInterceptorContext } from './interceptor.interfaces';
import { Container } from 'inversify';
import { ClassInfo } from '../../utils';

interface IInterceptorInstanceInfo {
  method: any;
  options: any;
}

interface IMethodInterceptorHandlers {
  before?(context: IInterceptorContext): Promise<boolean>;
  after?(context: IInterceptorContext): Promise<boolean>;
}

interface IControllerInterceptorHandlers {
  [method: string]: IMethodInterceptorHandlers;
}

export abstract class InterceptorResolver {

  static getControllerInterceptors(classDef: any, container: Container): IControllerInterceptorHandlers | undefined {
    const interceptorsInfo = ControllerMetadata.getInterceptors<IInterceptorMetadataInfo>(classDef);
    const targetMethods = ClassInfo.getMethods(classDef);

    const controllerHandlers: IControllerInterceptorHandlers = {};

    if (interceptorsInfo.length && targetMethods.length) {

      targetMethods.forEach(targetMethod => {
        const methodInterceptorsHandlers = InterceptorResolver.getMethodInterceptors(interceptorsInfo, targetMethod, container);

        if (methodInterceptorsHandlers) {
          controllerHandlers[targetMethod] = methodInterceptorsHandlers;
        }
      });

    }

    return Object.keys(controllerHandlers).length ? controllerHandlers : undefined;
  }

  static hasInterceptors (classDef: any) {
    return ControllerMetadata.getInterceptors<IInterceptorMetadataInfo>(classDef).length > 0;
  }

  static getMethodInterceptors(interceptorsInfo: IInterceptorMetadataInfo[], methodName: string, container: Container): IMethodInterceptorHandlers | undefined {
    const methodInterceptorsInfo = interceptorsInfo.filter(interceptorInfo => {
      return interceptorInfo.method === methodName || !interceptorInfo.method;
    }).reverse();

    if (methodInterceptorsInfo.length) {
      const cptBefor: IInterceptorInstanceInfo[] = [];
      const cptAfter: IInterceptorInstanceInfo[] = [];
      let before: any, after: any;

      for (const interceptorInfo of methodInterceptorsInfo) {
        // TODO: handle if the guard can't be resolved from container outside and before calling this
        const interceptorInstance = container.get<IInterceptor>(interceptorInfo.classDef);

        if (interceptorInstance.before)
          cptBefor.push({ method: interceptorInstance.before, options: interceptorInfo.options });

        if (interceptorInstance.after)
          cptAfter.push({ method: interceptorInstance.after, options: interceptorInfo.options });
      }

      if (cptBefor.length) {
        before = async (context: IInterceptorContext) => {
          let state = true;

          for (const interceptorMethodInfo of cptBefor) {
            // TODO: handle if the guard can't be resolved from container outside and before calling this
            state = await interceptorMethodInfo.method(context, interceptorMethodInfo.options);
            if (!state) break;
          }

          return state;
        };
      }

      if (cptAfter.length) {
        after = async (context: IInterceptorContext) => {
          let state = true;

          for (const interceptorMethodInfo of cptAfter) {
            // TODO: handle if the guard can't be resolved from container outside and before calling this
            state = await interceptorMethodInfo.method(context, interceptorMethodInfo.options);
            if (!state) break;
          }

          return state;
        };
      }

      const result: IMethodInterceptorHandlers = {};

      if (before) result['before'] = before;
      if (after) result['after'] = after;

      return Object.keys(result).length ? result : undefined;
    }
  }
}