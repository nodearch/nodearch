import { Repository } from "../../../../../components";

@Repository() 
export class ProductRepository {
  getProducts = () => [{ id: 123, productType: 'test' }];
  getProductById = (id: number) => ({ id: 123, productType: 'test' });
}