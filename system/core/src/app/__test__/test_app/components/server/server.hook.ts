import { Hook, HookContext, IHook } from "../../../../../components";
import { ProductController } from "../product/product.controller.test";
import { UserController } from "../user/user.controller.test";

@Hook()
export class ServerHook implements IHook {

  async onStart(context: HookContext) {
    const userController = context.get<UserController>(UserController);
    const productController = context.get<ProductController>(ProductController);

    if(userController) {
      userController.getUsers();
      userController.getUserById(1);
    }

    if(productController) {
      productController.getProducts();
      productController.getProductById(1);
    }
  }
}