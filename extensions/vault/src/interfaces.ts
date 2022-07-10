export interface IVaultOptions {
  hostname?: string;
}

export interface IVaultAuth {
  client_token: string;
  accessor: string;
  policies: string[];
  token_policies: string[];
  metadata: {
    role: string;
    [key: string]: string;
  };
  lease_duration: number;
  renewable: boolean;
  entity_id: string;
  token_type: string;
  orphan: boolean;
}

export interface IDBGetCredsOptions {
  engine: string;
  token: string;
  role: string;
}

export interface IVaultResponse {
  request_id: string;
  lease_id: string;
  renewable: boolean;
  lease_duration: number;
  wrap_info: any;
  warnings: any;
}

export interface IDBGetCredsResponse extends IVaultResponse {
  data: {
    username: string;
    password: string;
  }
}


export interface IAWSGetCredsOptions {
  engine: string;
  token: string;
  role: string;
  ttl?: string;
  role_arn?: string;
}

export interface IAWSGetCredsResponse extends IVaultResponse {
  data: {
    access_key: string;
    secret_key: string;
    security_token: string;
  }
}

export interface IKVSecretEngineOptions {
  engine: string;
  token: string;
}

export interface IKVData {
  [key: string]: any;
}

export interface IKVSecretResponse<T> extends IVaultResponse {
  data: T;
}

export interface IJWTAuthOptions {
  engine: string;
  jwt: string;
  role: string;
}

export interface IAuthResponse extends IVaultResponse {
  auth: {
    client_token: string;
    accessor: string;
    policies: string[];
    token_policies: string[];
    metadata: {
      [key: string]: any;
    };
    lease_duration: number;
    renewable: boolean;
    entity_id: string;
    token_type: string;
    orphan: boolean
  };
}

export interface IAppRoleAuthOptions {
  engine: string;
  roleId: string;
  secretId: string;
}