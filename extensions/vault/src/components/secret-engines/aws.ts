import request from 'request-promise-native';
import { Service } from '@nodearch/core';
import { VaultConfig } from '../vault.config.js';
import { IAWSGetCredsOptions, IAWSGetCredsResponse } from '../../interfaces.js';
import { VaultError } from '../../vault.error.js';


@Service()
export class AWSSecretEngine {
  constructor(private vaultConfig: VaultConfig) {}

  async getCreds(options: IAWSGetCredsOptions): Promise<IAWSGetCredsResponse> {
    try {
      const result = await request({
        method: 'POST',
        uri: `${this.vaultConfig.hostname}/v1/${options.engine}/creds/${options.role}`,
        headers: {
          'X-Vault-Token': options.token
        },
        json: true,
        body: {
          ttl: options.ttl || '3600s',
          role_arn: options.role_arn || undefined
        }
      });

      return result;
    }
    catch(e) {
      throw new VaultError(e);
    }
  }
}