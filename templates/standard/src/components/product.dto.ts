import { Data, Field } from '@nodearch/core';

@Data()
export class ProductDto {
  @Field()
  id: number;
  
  @Field()
  name: string;
}