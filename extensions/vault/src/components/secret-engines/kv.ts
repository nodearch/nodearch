import axios from 'axios';
import { Service } from '@nodearch/core';
import { VaultConfig } from '../vault.config.js';
import { IKVSecretEngineOptions, IKVData, IKVSecretResponse } from '../../interfaces.js';
import { VaultError } from '../../vault.error.js';

@Service()
export class KVSecretEngine {
  constructor(private vaultConfig: VaultConfig) { }

  async createSecret(options: IKVSecretEngineOptions, secretKey: string, data: IKVData): Promise<void> {
    try {
      const url = `${this.vaultConfig.hostname}/v1/${options.engine}/${secretKey}`;

      await axios.request({
        method: 'POST',
        url,
        headers: {
          'X-Vault-Token': options.token
        },
        data
      });
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

  async getSecret<T = any>(options: IKVSecretEngineOptions, secretKey: string): Promise<IKVSecretResponse<T>> {
    try {
      const url = `${this.vaultConfig.hostname}/v1/${options.engine}/${secretKey}`;

      const result = await axios.request<IKVSecretResponse<T>>({
        method: 'GET',
        url,
        headers: {
          'X-Vault-Token': options.token
        }
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

  async listSecrets(options: IKVSecretEngineOptions, path?: string): Promise<string[]> {
    try {
      const url = `${this.vaultConfig.hostname}/v1/${options.engine}${ path? '/' + path : '' }`;

      const result = await axios.request<string[]>({
        method: 'LIST',
        url,
        headers: {
          'X-Vault-Token': options.token
        }
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

  async deleteSecret(options: IKVSecretEngineOptions, secretKey: string) {
    try {
      const url = `${this.vaultConfig.hostname}/v1/${options.engine}/${secretKey}`;

      await axios.request({
        method: 'DELETE',
        url,
        headers: {
          'X-Vault-Token': options.token
        }
      });
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