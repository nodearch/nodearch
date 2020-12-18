import request from 'request-promise-native';
import { Service } from "@nodearch/core";
import { VaultConfig } from "../vault.config";
import { IKVSecretEngineOptions, IKVData, IKVSecretResponse } from '../../interfaces';
import { VaultError } from '../../vault.error';

@Service()
export class KVSecretEngine {
  constructor(private vaultConfig: VaultConfig) { }

  async createSecret(options: IKVSecretEngineOptions, secretKey: string, data: IKVData): Promise<void> {
    try {
      const uri = `${this.vaultConfig.hostname}/v1/${options.engine}/${secretKey}`;

      await request({
        method: 'POST',
        uri,
        headers: {
          'X-Vault-Token': options.token
        },
        json: true,
        body: data
      });
    }
    catch (e) {
      throw new VaultError(e);
    }

  }

  async getSecret<T = any>(options: IKVSecretEngineOptions, secretKey: string): Promise<IKVSecretResponse<T>> {
    try {
      const uri = `${this.vaultConfig.hostname}/v1/${options.engine}/${secretKey}`;

      return await request({
        method: 'GET',
        uri,
        headers: {
          'X-Vault-Token': options.token
        },
        json: true
      });
    }
    catch (e) {
      throw new VaultError(e);
    }
  }

  async listSecrets(options: IKVSecretEngineOptions, path?: string): Promise<string[]> {
    try {
      const uri = `${this.vaultConfig.hostname}/v1/${options.engine}${ path? '/' + path : '' }`;

      return await request({
        method: 'LIST',
        uri,
        headers: {
          'X-Vault-Token': options.token
        },
        json: true
      });
    }
    catch (e) {
      throw new VaultError(e);
    }
  }

  async deleteSecrets(options: IKVSecretEngineOptions, secretKey: string) {
    try {
      const uri = `${this.vaultConfig.hostname}/v1/${options.engine}/${secretKey}`;

      await request({
        method: 'DELETE',
        uri,
        headers: {
          'X-Vault-Token': options.token
        },
        json: true
      });
    }
    catch (e) {
      throw new VaultError(e);
    }
  }
}