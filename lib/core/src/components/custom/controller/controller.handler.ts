import { Container } from 'inversify';
import { ClassConstructor } from '../../utils';
import { IComponentHandler, IComponentInfo } from '../interfaces';
import { BaseComponentHandler } from "../base-handler";
import { ProxyFactory } from '../proxy-factory';
import { InterceptorResolver } from '../interceptor/interceptor-resolver';


export class ControllerHandler extends BaseComponentHandler implements IComponentHandler {
  constructor(container: Container) {
    super(container);
  }

  register(classDef: ClassConstructor, componentInfo: IComponentInfo) {

    const binding = this.bindComponent({
      component: classDef,
      ...componentInfo
    });

    const hasInterceptors = InterceptorResolver.hasInterceptors(classDef);

    if (hasInterceptors) {
      binding.onActivation((context, target) => {
        // TODO: what if we couldn't resolve interceptor from the container
        const interceptors = InterceptorResolver.getControllerInterceptors(classDef, <Container>context.container);

        if (!interceptors) return target;

        return ProxyFactory.proxyMethodCall({
          target,
          before: async function (methodName: string, args: any[], paramTypes: string[]) {
            const beforeMethod = interceptors[methodName]?.before;

            if (beforeMethod) {
              return beforeMethod({
                component: target,
                methodName,
                paramTypes,
                args
              });
            }
            else return true;
          },
          after: async function (methodName: string, args: any[], paramTypes: string[]) {
            const afterMethod = interceptors[methodName]?.after;

            if (afterMethod) {
              return afterMethod({
                component: target,
                methodName,
                paramTypes,
                args
              });
            }
            else return true;
          }
        })
      });
    }
  }

  registerExtension(classDef: ClassConstructor, componentInfo: IComponentInfo, extContainer: Container) {
    this.bindExtComponent({
      component: classDef,
      ...componentInfo,
      extContainer
    });
  }
}