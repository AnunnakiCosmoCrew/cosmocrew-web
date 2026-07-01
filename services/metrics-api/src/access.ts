import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

/**
 * Cloudflare Access JWT verification.
 *
 * The subdomain is already gated at Cloudflare's edge, but the Worker verifies
 * the Access JWT itself as defense in depth (adr/0003): a direct origin request
 * without a valid token gets nothing. Signature is checked against Cloudflare's
 * public keys (JWKS) and the token's `iss`/`aud` must match our team + Access
 * application.
 */

export interface AccessEnv {
  /** Cloudflare Zero Trust team domain, e.g. https://cosmocrew.cloudflareaccess.com */
  TEAM_DOMAIN: string;
  /** Access application Audience (AUD) tag. */
  POLICY_AUD: string;
}

export interface AccessIdentity {
  email?: string;
  sub?: string;
  raw: JWTPayload;
}

// Cache the JWKS in module scope so a warm isolate reuses Cloudflare's keys
// instead of refetching them on every request.
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
let jwksDomain: string | null = null;

function getJwks(teamDomain: string): ReturnType<typeof createRemoteJWKSet> {
  if (!jwks || jwksDomain !== teamDomain) {
    jwks = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
    jwksDomain = teamDomain;
  }
  return jwks;
}

/**
 * Verify the Access JWT on a request. Resolves to the identity on success;
 * throws on any failure (missing/expired/invalid token, wrong issuer/audience).
 * Callers map a throw to HTTP 403 — never leak the reason to the client.
 */
export async function verifyAccessJwt(
  request: Request,
  env: AccessEnv,
): Promise<AccessIdentity> {
  if (!env.POLICY_AUD || env.POLICY_AUD.startsWith('REPLACE_')) {
    throw new Error('POLICY_AUD is not configured');
  }

  const token =
    request.headers.get('cf-access-jwt-assertion') ??
    readCookie(request, 'CF_Authorization');
  if (!token) throw new Error('missing Cloudflare Access JWT');

  const { payload } = await jwtVerify(token, getJwks(env.TEAM_DOMAIN), {
    issuer: env.TEAM_DOMAIN,
    audience: env.POLICY_AUD,
  });

  return {
    email: typeof payload.email === 'string' ? payload.email : undefined,
    sub: payload.sub,
    raw: payload,
  };
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return null;
}
