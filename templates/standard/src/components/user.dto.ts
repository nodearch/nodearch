import { Data, Field } from '@nodearch/core';
import { ProductDto } from './product.dto.js';

@Data()
export class UserDto {
  @Field()
  id: number;
  
  @Field()
  username: string;

  @Field()
  product: ProductDto;
}