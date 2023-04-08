import { interfaces } from 'inversify';
import { IBindActivationHandler, IBindDeactivationHandler } from './interfaces.js';


export class BindingHooks {

  static activation (
    binding: interfaces.BindingWhenOnSyntax<any>,
    onActivation: IBindActivationHandler<any>[]
  ) {
  
    onActivation.forEach(handler => {
      binding.onActivation(this.activationHandlerWrap(handler));
    });
  
  }

  static deactivation (
    binding: interfaces.BindingWhenOnSyntax<any>,
    onDeactivation: IBindDeactivationHandler<any>[]
  ) {
    onDeactivation.forEach(handler => {
      binding.onDeactivation(this.deactivationHandlerWrap(handler));
    });
  }

  // We'll need to pass a custom context to the activation handler.
  private static activationHandlerWrap<T>(handler: IBindActivationHandler<T>) {
    return (context: interfaces.Context, instance: T) => {
      // TODO: pass custom context
      return handler({}, instance);
    };
  }

  // It doesn't do much, but it's here just in case inversify API changes.
  private static deactivationHandlerWrap<T>(handler: IBindDeactivationHandler<T>) {
    return (instance: T) => {
      return handler(instance);
    };
  }
}