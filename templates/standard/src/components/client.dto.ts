import { Data, Field } from '@nodearch/core';
import { UserDto } from './user.dto.js';
import { JsonGet } from '@nodearch/jsonata';


@Data()
export class ClientDTO {

  @JsonGet('data.client.key')
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

  @Field()
  user: UserDto;

}