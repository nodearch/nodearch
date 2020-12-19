import { Controller } from "../../../../../components";
import { UserService } from "../user/user.service.test";
import { ProductService } from "./product.service.test";

@Controller() 
export class ProductController {
  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {}

  getProducts = () => this.productService.getProducts();
  getProductById = (id: number) =>  {
    const product: any = this.productService.getProductById(id);
    product.user = this.userService.getUserById(id);

    return product;
  };
}