import jwt from 'jsonwebtoken';


export interface IKeycloakOptions {
  hostname?: string;
  issuer?: string;
  clientId?: string;
  jwtVerify?: jwt.VerifyOptions;
  claims?: {
    [key: string]: string | number | boolean | { (value: any): boolean };
  };
}

/**
 * JWT - OpenID Connect
 * https://openid.net/specs/openid-connect-core-1_0.html
 *
 */
export interface IJWT {
  header: IJWTHeader;
  payload: IJWTPayload;
}

export interface IJWTHeader {
  alg: string;
  typ?: string;
  kid: string; // not optional because we check on that in the token decoding process already
  jku?: string;
  x5u?: string;
  x5t?: string;
}

export interface IJWTPayload {
  /**
     JWT ID. A unique identifier for the token, which can be used to
     prevent reuse of the token. These tokens MUST only be used once,
     unless conditions for reuse were negotiated between the parties.
     any such negotiation is beyond the scope of this specification.
    */
   jti: string;

   /**
     Expiration time on or after which the ID Token MUST NOT be
     accepted for processing.
    */
   exp: number;

   /**
     Time at which the JWT was issued.
    */
   iat?: number;

   /**
     This MUST contain the client_id of the OAuth Client.
    */
   iss: string;

   /**
     Audience(s) that this ID Token is intended for.
     It MUST contain the OAuth 2.0 client_id of the Relying Party
     as an audience value. It MAY also contain identifiers
     for other audiences. In the general case, the aud value
     is an array of case sensitive strings. In the common special
     case when there is one audience, the aud value
     MAY be a single case sensitive string.
    */
   aud: string | string[];

   /**
     Subject. This MUST contain the client_id of the OAuth Client.
    */
   sub: string;

   /**
     The "typ" (type) Header Parameter defined by [JWS] and [JWE] is used
     by JWT applications to declare the media type [IANA.MediaTypes] of
     this complete JWT.  This is intended for use by the JWT application
     when values that are not JWTs could also be present in an application
     data structure that can contain a JWT object; the application can use
     this value to disambiguate among the different kinds of objects that
     might be present.  It will typically not be used by applications when
     it is already known that the object is a JWT.  This parameter is
     ignored by JWT implementations; any processing of this parameter is
     performed by the JWT application.  If present, it is RECOMMENDED that
     its value be "JWT" to indicate that this object is a JWT.  While
     media type names are not case sensitive, it is RECOMMENDED that "JWT"
     always be spelled using uppercase characters for compatibility with
     legacy implementations.  Use of this Header Parameter is OPTIONAL.
    */
   typ?: string;

   /**
     Authorized party - the party to which the ID Token was issued.
     If present, it MUST contain the OAuth 2.0 Client ID of this party.
     This Claim is only needed when the ID Token has a single audience
     value and that audience is different than the authorized party.
     It MAY be included even when the authorized party is the same as
     the sole audience. The azp value is a case sensitive string
     containing a StringOrURI value.
    */
   azp?: string;

   /**
     Time when the End-User authentication occurred.
     Its value is a JSON number representing the number of seconds
     from 1970-01-01T0:0:0Z as measured in UTC until the date/time.
     When a max_age request is made or when auth_time is requested
     as an Essential Claim, then this Claim is REQUIRED.
     otherwise, its inclusion is OPTIONAL.
     (The auth_time Claim semantically corresponds to the OpenID 2.0
       PAPE [OpenID.PAPE] auth_time response parameter.)
    */
   auth_time?: number;

   /**
     String value used to associate a Client session with an ID Token,
     and to mitigate replay attacks. The value is passed through
     unmodified from the Authentication Request to the ID Token.
     If present in the ID Token, Clients MUST verify that
     the nonce Claim Value is equal to the value of the nonce parameter
     sent in the Authentication Request.
     If present in the Authentication Request, Authorization Servers
     MUST include a nonce Claim in the ID Token with the Claim Value
     being the nonce value sent in the Authentication Request.
     Authorization Servers SHOULD perform no other processing on
     nonce values used. The nonce value is a case sensitive string.
    */
   nonce?: string;

   /**
     Authentication Context Class Reference.
     String specifying an Authentication Context Class Reference
     value that identifies the Authentication Context Class that
     the authentication performed satisfied.
     The value "0" indicates the End-User authentication did not meet
     the requirements of ISO/IEC 29115 [ISO29115] level
     1. Authentication using a long-lived browser cookie,
     for instance, is one example where the use of "level 0" is appropriate.
     Authentications with level 0 SHOULD NOT be used to authorize
     access to any resource of any monetary value.
     (This corresponds to the OpenID 2.0 PAPE [OpenID.PAPE] nist_auth_level 0.)
     An absolute URI or an RFC 6711 [RFC6711] registered name SHOULD
     be used as the acr value; registered names MUST NOT be used with
     a different meaning than that which is registered.
     Parties using this claim will need to agree upon the meanings
     of the values used, which may be context-specific.
     The acr value is a case sensitive string.
    */
   acr?: string;

   /**
     OpenID Connect requests MUST contain the openid scope value.
     If the openid scope value is not present, the behavior is
     entirely unspecified. Other scope values MAY be present.
     Scope values used that are not understood by an implementation
     SHOULD be ignored. See Sections 5.4 and 11 for
     additional scope values defined by this specification.
    */
   scope: string;

   /**
     True if the End-User's e-mail address has been verified;
     otherwise false. When this Claim Value is true,
     this means that the OP took affirmative steps to ensure
     that this e-mail address was controlled by the End-User
     at the time the verification was performed.
     The means by which an e-mail address is verified is context-specific,
     and dependent upon the trust framework or contractual agreements
     within which the parties are operating.
    */
   email_verified?: boolean;

   /**
     End-User's full name in displayable form including all name parts,
     possibly including titles and suffixes, ordered according to the
     End-User's locale and preferences.
    */
   name?: string;

   /**
     Shorthand name by which the End-User wishes to be referred to at the RP,
     such as janedoe or j.doe. This value MAY be any valid JSON string including
     special characters such as @, /, or whitespace.
     The RP MUST NOT rely upon this value being unique, as discussed in Section 5.7.
    */
   preferred_username?: string;

   /**
     Given name(s) or first name(s) of the End-User.
     Note that in some cultures, people can have multiple given names;
     all can be present, with the names being separated by space characters.
    */
   given_name?: string;

   /**
     Surname(s) or last name(s) of the End-User.
     Note that in some cultures, people can have multiple family names or no family name;
     all can be present, with the names being separated by space characters.
    */
   family_name?: string;

   /**
     End-User's preferred e-mail address.
     Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax.
     The RP MUST NOT rely upon this value being unique, as discussed in Section 5.7.
    */
   email?: string;

   /**
     list of origins allowed to use this token
    */
   'allowed-origins'?: string[];

   /**
     Keycloak Realm Access
    */
   realm_access: {
     roles: string[];
     [key: string]: any;
   };

   /**
     Keycloak Resource Access
    */
   resource_access: {
     [clientId: string]: {
       roles: string[];
       [key: string]: any;
     }
   };
}

export interface IAuthInfo {
  token: string;
  info: IJWTPayload;
  realm: string;
  permissions?: [{
    scopes: string[],
    rsid: string;
    rsname: string;
  }];
}