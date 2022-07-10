import request from 'request-promise-native';
import { Service } from '@nodearch/core';
import { VaultConfig } from '../vault.config';
import { IDBGetCredsOptions, IDBGetCredsResponse } from '../../interfaces';
import { VaultError } from '../../vault.error';


@Service()
export class DBSecretEngine {
  constructor(private vaultConfig: VaultConfig) {}

  async getCreds(options: IDBGetCredsOptions): Promise<IDBGetCredsResponse> {
    try {
      const result = await request({
        method: 'GET',
        uri: `${this.vaultConfig.hostname}/v1/${options.engine}/creds/${options.role}`,
        headers: {
          'X-Vault-Token': options.token
        },
        json: true,
        body: {}
      });

      return result;
    }
    catch(e) {
      throw new VaultError(e);
    }
  }
}