import { Hook, IHook } from '@nodearch/core'; 

@Hook()
export class {{className}}Hook implements IHook {
  async onStart() {
    /**
    * Logic goes here will be executed on the application starting
    * The application will not start until this method is resolved
    * If you throw an error, the application will not start
    */
  }

  async onStop() {
    /**
    * Logic goes here will be executed on the application stopping
    * The application will not stop until this method is resolved
    * If you throw an error, the application stop regardless
    */
  }
}