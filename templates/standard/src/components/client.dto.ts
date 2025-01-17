import { Data, Field } from '@nodearch/core';


@Data()
export class ClientDTO {
  @Field()
  id: string;
  
  @Field()
  name: string;
  
  @Field()
  email: string;
  
  @Field()
  phone: string;
  
  @Field()
  address: string;
  
  @Field()
  city: string;
  
  @Field()
  state: string;
  
  @Field()
  zip: string;
  
  @Field(String)
  country: string[];
}