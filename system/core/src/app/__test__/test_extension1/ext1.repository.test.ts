import { Repository } from "../../../components";

@Repository()
export class Ext1Repository {
  
  validateConnection() {
    return true;
  }

  tryToConnect() {
    return true;
  }
}