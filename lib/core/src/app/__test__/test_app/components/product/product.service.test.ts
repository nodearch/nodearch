import { Service } from "../../../../../components";
import { ProductRepository } from "./product.repository.test";

@Service() 
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  getProducts = () => this.productRepository.getProducts();
  getProductById = (id: number) =>  this.productRepository.getProductById(id);
}