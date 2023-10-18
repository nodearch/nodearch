import axios from 'axios';
import { Service } from '@nodearch/core';
import { VaultConfig } from '../vault.config.js';
import { IDBGetCredsOptions, IDBGetCredsResponse } from '../../interfaces.js';
import { VaultError } from '../../vault.error.js';


@Service()
export class DBSecretEngine {
  constructor(private vaultConfig: VaultConfig) {}

  async getCreds(options: IDBGetCredsOptions): Promise<IDBGetCredsResponse> {
    try {
      const result = await axios.request<IDBGetCredsResponse>({
        method: 'GET',
        url: `${this.vaultConfig.hostname}/v1/${options.engine}/creds/${options.role}`,
        headers: {
          'X-Vault-Token': options.token
        },
        data: {}
      });

      return result.data;
    }
    catch(error: any) {
      if (error.response) {
        throw new VaultError(error.response);
      }
      else {
        throw new VaultError({ data: error.message, status: 500 });
      }
    }
  }
}