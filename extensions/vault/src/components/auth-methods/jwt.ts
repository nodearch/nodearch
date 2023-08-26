import request from 'request-promise-native';
import { Service } from "@nodearch/core";
import { VaultConfig } from "../vault.config.js";
import { IJWTAuthOptions, IAuthResponse } from '../../interfaces.js';
import { VaultError } from '../../vault.error.js';


@Service()
export class JWTAuthMethod {
  constructor(private vaultConfig: VaultConfig) {} 

  async login(options: IJWTAuthOptions): Promise<IAuthResponse> {
    try {
      return await request({
        method: 'POST',
        uri: `${this.vaultConfig.hostname}/v1/auth/${options.engine}/login`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          role: options.role,
          jwt: options.jwt
        },
        json: true
      });
      }
    catch(e) {
      throw new VaultError(e);
    }
  }
}