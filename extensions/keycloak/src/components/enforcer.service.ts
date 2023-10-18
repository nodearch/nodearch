import { IAuthInfo } from '../interfaces.js';
import { EnforcerResponseMode } from '../enums.js';
import axios from 'axios';
import { KeycloakConfig } from './keycloak.config.js';
import queryString from 'query-string';
import { Service } from '@nodearch/core';


@Service()
export class KeycloakEnforcer {

  constructor(private keycloakConfig: KeycloakConfig) {}
  
  async enforce(permissions: string[], authInfo: IAuthInfo, responseMode?: EnforcerResponseMode) {
    const payload = {
      grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
      audience: this.keycloakConfig.clientId,
      response_mode: responseMode || 'permissions',
      permission: permissions
    };

    try {
      const result = await axios.post(
        `${this.keycloakConfig.hostname}/auth/realms/${authInfo.realm}/protocol/openid-connect/token`,
        queryString.stringify(payload),
        {
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        }
      );

      return result.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`failed to enforce permissions ${error.response.status}:${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        throw new Error(`failed to enforce permissions ${JSON.stringify(error.request)}`);
      } else {
        throw new Error(`failed to enforce permissions ${error.message}`);
      }
    }

  }
}