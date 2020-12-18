import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Service } from '@nodearch/core';
import { IAuthInfo, IJWT } from '../interfaces';
import { KeycloakConfig } from './keycloak.config';


@Service()
export class KeycloakAuth {
  
  constructor(private keycloakConfig: KeycloakConfig) {}

  async auth(token: string): Promise<IAuthInfo> {
    const decodedToken = this.decodeToken(token);
    const realm = this.getRealmName(decodedToken);
    const realmURL = this.keycloakConfig.hostname + "/auth/realms/" + realm;

    await this.verifyToken(realmURL, decodedToken, token);
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

  private getRealmName(decodedToken: IJWT) {
    const matchResult = decodedToken.payload.iss.match(this.keycloakConfig.hostRegExp);

    if (!matchResult || !matchResult[1]) {
      throw new Error('unknown token issuer!');
    }

    return matchResult[2];
  }

  private async verifyToken(realmURL: string, decodedToken: IJWT, token: string): Promise<IJWT> {
    return new Promise((resolve, reject) => {

      const client = jwksClient({
        jwksUri: realmURL + '/protocol/openid-connect/certs'
      });

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
}