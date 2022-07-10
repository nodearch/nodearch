import { Service } from "../../../components";
import { Ext2Service } from "../test_extension2/services/ext1.service.test";
import { Ext1Config } from "./ext1.config.test";
import { Ext1Repository } from "./ext1.repository.test";

@Service()
export class Ext1Service {
  constructor(
    private ext1Repository: Ext1Repository,
    private ext2Service: Ext2Service,
    private ext1Config: Ext1Config
  ) {}

  connect() {
    this.ext2Service.validateUrl(this.ext1Config.url);
    this.ext1Repository.validateConnection();
    this.ext1Repository.tryToConnect();
  }
}