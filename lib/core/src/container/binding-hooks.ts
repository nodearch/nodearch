import { interfaces } from 'inversify';
import { IBindActivationHandler, IBindDeactivationHandler } from './interfaces.js';


export function activation (
  binding: interfaces.BindingWhenOnSyntax<any>,
  onActivation?: IBindActivationHandler<any>[]
) {

}

export function deactivation (
  binding: interfaces.BindingWhenOnSyntax<any>,
  onDeactivation?: IBindDeactivationHandler<any>[]
) {
  
}