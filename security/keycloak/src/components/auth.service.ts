import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Service } from '@nodearch/core';
import { IAuthInfo, IJWT } from '../interfaces';
import { KeycloakConfig } from './keycloak.config';

@Service()
export class KeycloakAuth {
  realmPattern: RegExp;

  constructor(private keycloakConfig: KeycloakConfig) {
    this.realmPattern = /^[a-zA-Z0-9_-]+$/;
  }

  async auth(token: string, realmName?: string): Promise<IAuthInfo> {
    const decodedToken = this.decodeToken(token);
    const realm = realmName || this.getRealmFromJWT(decodedToken);

    this.validateRealmName(realm);

    const jwksUri = `${this.keycloakConfig.hostname}/auth/realms/${realm}/protocol/openid-connect/certs`

    await this.verifyToken(jwksUri, decodedToken, token);
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

  private getRealmFromJWT(decodedToken: IJWT) {
    const realmJwtPath = this.keycloakConfig.realmJWTPath;

    let realmName;

    if (typeof realmJwtPath === 'function') {
      realmName = realmJwtPath({...decodedToken});
    }
    else {
      realmName = decodedToken.payload[realmJwtPath];
    }

    if (realmName) return realmName;
    else throw new Error('failed to get realm from token');
  }


  private validateRealmName(realm: string) {
    const matches = realm.match(this.realmPattern);

    if (!matches) throw new Error('invalid realm name pattern');
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
}