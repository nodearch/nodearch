import axios from 'axios';
import { Service } from '@nodearch/core';
import { VaultConfig } from '../vault.config.js';
import { IAppRoleAuthOptions, IAuthResponse } from '../../interfaces.js';
import { VaultError } from '../../vault.error.js';

@Service()
export class AppRoleAuthMethod {
  constructor(private vaultConfig: VaultConfig) { }

  async login(options: IAppRoleAuthOptions): Promise<IAuthResponse> {
    try {

      const result = await axios.request<IAuthResponse>({
        method: 'POST',
        url: `${this.vaultConfig.hostname}/v1/auth/${options.engine}/login`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          role_id: options.roleId,
          secret_id: options.secretId
        }
      });

      return result.data;
    }
    catch (error: any) {
      if (error.response) {
        throw new VaultError(error.response);
      }
      else {
        throw new VaultError({ data: error.message, status: 500 });
      }
    }
  }
}