import { Hook, IHook } from "../../../../../components";
import { Ext1Service } from "../../../test_extension1/ext1.service.test";

@Hook()
export class DBHook implements IHook {
  constructor(private ext1Service: Ext1Service) {}

  async onInit() {
    this.ext1Service.connect();
  }
}