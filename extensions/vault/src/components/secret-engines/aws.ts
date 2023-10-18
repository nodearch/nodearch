import axios from 'axios';
import { Service } from '@nodearch/core';
import { VaultConfig } from '../vault.config.js';
import { IAWSGetCredsOptions, IAWSGetCredsResponse } from '../../interfaces.js';
import { VaultError } from '../../vault.error.js';


@Service()
export class AWSSecretEngine {
  constructor(private vaultConfig: VaultConfig) {}

  async getCreds(options: IAWSGetCredsOptions): Promise<IAWSGetCredsResponse> {
    try {
      const result = await axios.request<IAWSGetCredsResponse>({
        method: 'POST',
        url: `${this.vaultConfig.hostname}/v1/${options.engine}/creds/${options.role}`,
        headers: {
          'X-Vault-Token': options.token
        },
        data: {
          ttl: options.ttl || '3600s',
          role_arn: options.role_arn || undefined
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