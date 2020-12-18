import { Config, ConfigManager } from '@nodearch/core';
import { VerifyOptions } from 'jsonwebtoken';

@Config()
export class KeycloakConfig {

  clientId: string;
  hostname: string;
  issuer: string;
  hostRegExp: RegExp;
  jwtVerify: VerifyOptions;
  claims?: {
    [key: string]: string | number | boolean | { (value: any): boolean };
  };

  constructor(config: ConfigManager) {

    this.clientId = config.env({
      defaults: { all: 'master' },
      external: 'clientId'
    });

    this.hostname = this.formatHostName(
      config.env({
        defaults: {
          all: 'http://localhost:8080'
        },
        external: 'hostname'
      })
    );

    this.issuer = this.formatHostName(
      config.env({
        defaults: {
          all: this.hostname
        },
        external: 'issuer'
      })
    );

    this.hostRegExp = this.getHostRegExp(this.issuer);

    this.jwtVerify = config.env({
      defaults: { all: { algorithms: ['RS256'] } },
      external: 'jwtVerify'
    });

    this.claims = config.env({
      required: false,
      external: 'claims'
    })
  }

  private formatHostName(hostname: string) {
    const url = new URL(hostname);

    if (url.origin === 'null') {
      throw new Error('Invalid Keycloak URL => ' + hostname);
    }

    return (url.href.charAt(url.href.length - 1) === '/') ? url.href.slice(0, -1) : url.href;
  }

  private getHostRegExp(host: string) {
    return new RegExp("(" + host + ")\/auth\/realms\/([a-z_-]+)");
  }
}