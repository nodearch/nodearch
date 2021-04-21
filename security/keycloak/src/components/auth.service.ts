import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Service } from '@nodearch/core';
import { IAuthInfo, IJWT, IOpenIdConfiguration } from '../interfaces';
import { KeycloakConfig } from './keycloak.config';
import request from 'request-promise-native';

@Service()
export class KeycloakAuth {
  
  constructor(private keycloakConfig: KeycloakConfig) {}

  async auth(token: string, realmName?: string, realmAttribute?: string): Promise<IAuthInfo> {
    const decodedToken = this.decodeToken(token);
    const realm = this.getRealmName(decodedToken, realmName, realmAttribute);
    const { jwks_uri, issuer } = await this.getOpenIdConfiguration(realm);

    if (realmName && realmAttribute) this.validateIssuer(decodedToken, issuer);

    await this.verifyToken(jwks_uri, decodedToken, token);
    this.verifyClaims(decodedToken);

    return {
      token,
      realm,
      info: decodedToken.payload
    };
  }

  private decodeToken(token: string): IJWT {
    const decoded: IJWT = <IJWT>jwt.decode(token, { complete: true, json: true });

    if (!decoded || !decoded.header.kid || !decoded.payload.iss) {
      throw new Error('auth token is invalid');
    }

    return decoded;
  }

  private getRealmName(decodedToken: IJWT, realmName?: string, realmAttribute?: string) {
    if(realmName) {
      return realmName;
    }
    else if (realmAttribute) {
      const realm = decodedToken.payload[realmAttribute];

      if (realm) return realm;
      else throw new Error('failed to get realm from token');
    }
    else {
      const matchResult = decodedToken.payload.iss.match(this.keycloakConfig.hostRegExp);

      if (!matchResult || !matchResult[1]) {
        throw new Error('unknown token issuer!');
      }
  
      return matchResult[2];
    }
  }


  private validateIssuer(decodedToken: IJWT, issuer: string) {
    if (decodedToken.payload.iss !== issuer) {
      throw new Error('unknown token issuer!');
    }
  }

  private async verifyToken(jwksUri: string, decodedToken: IJWT, token: string): Promise<IJWT> {
    return new Promise((resolve, reject) => {

      const client = jwksClient({ jwksUri });

      client.getSigningKey(decodedToken.header.kid, (err: Error | null, key: jwksClient.SigningKey) => {

        if (err) {
          return reject(new Error('cannot verify token ' + err.message));
        }

        jwt.verify(
          token,
          key.getPublicKey(), this.keycloakConfig.jwtVerify,
          (err: any, decoded?: object) => {

            if (err) {
              reject(err);
            }
            else if (!decoded) {
              reject(new Error('invalid token'));
            }
            else {
              resolve(<IJWT>decoded);
            }
          }
        );

      });

    });
  }

  private verifyClaims(decodedToken: IJWT) {
    if (this.keycloakConfig.claims) {
      for(const claimName in this.keycloakConfig.claims) {
        const claimValueExp = this.keycloakConfig.claims[claimName];
        const tokenClaimValue = (<any>decodedToken.payload)[claimName];
        let result: boolean = false;

        if (typeof claimValueExp === 'function') {
          result = claimValueExp(tokenClaimValue);
        }
        else if(tokenClaimValue !== claimValueExp) {
          result = false;
        }
        else {
          result = true;
        }

        if (!result) {
          throw new Error('invalid token claims');
        }
      }
    }
  }

  private async getOpenIdConfiguration(realmName: string) {
    try {
      const config: IOpenIdConfiguration = await request({
        method: 'GET',
        uri: `${this.keycloakConfig.hostname}/auth/realms/${realmName}/.well-known/openid-configuration`,
        json: true
      }); 

      return config;
    } 
    catch (error) {
      throw new Error('invalid realm');
    }
  }
}