import { JsonataTransform, JsonGet } from '@nodearch/jsonata';


@JsonataTransform({})
export class ClientMapper {

  @JsonGet('data.client.key')
  id: number;

}

