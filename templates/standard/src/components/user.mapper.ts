import { JsonataTransform, JsonGet } from '@nodearch/jsonata';
import { ClientMapper } from './client.mapper.js';


// Rename to JsonTransform, uses classes as entities 
@JsonataTransform({})
export class UserMapper {

  @JsonGet('data.client')
  id: ClientMapper; // will resolve client mapper using data.client 

}

