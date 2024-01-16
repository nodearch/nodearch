import { IAuthInfo } from '../interfaces';
import { EnforcerResponseMode } from '../enums';
import request from 'request-promise-native';
import { KeycloakConfig } from './keycloak.config';
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

    return request({
      method: 'POST',
      uri: `${this.keycloakConfig.hostname}/realms/${authInfo.realm}/protocol/openid-connect/token`,
      headers: {
        Authorization: `Bearer ${authInfo.token}`
      },
      form: queryString.stringify(payload),
      json: true
    });
  }
}