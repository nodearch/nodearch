import request from 'request-promise-native';
import { Service } from "@nodearch/core";
import { VaultConfig } from "../vault.config";
import { IAppRoleAuthOptions, IAuthResponse } from '../../interfaces';
import { VaultError } from '../../vault.error';


@Service()
export class AppRoleAuthMethod {
  constructor(private vaultConfig: VaultConfig) { }

  async login(options: IAppRoleAuthOptions): Promise<IAuthResponse> {
    try {

      return await request({
        method: 'POST',
        uri: `${this.vaultConfig.hostname}/v1/auth/${options.engine}/login`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          role_id: options.roleId,
          secret_id: options.secretId
        },
        json: true
      });

    }
    catch (e) {
      throw new VaultError(e);
    }
  }
}