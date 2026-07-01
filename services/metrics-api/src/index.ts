import { verifyAccessJwt } from './access';
import { stubPayload } from './sample';
import type { MetricsPayload } from '@cosmocrew/metrics-contract';

export interface Env {
  TEAM_DOMAIN: string;
  POLICY_AUD: string;
  ALLOWED_ORIGIN: string;
  METRICS_KV: KVNamespace;
}

const KV_KEY = 'latest';

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }
    if (url.pathname === '/health') {
      return json({ ok: true }, env);
    }

    if (url.pathname === '/api/metrics') {
      if (request.method !== 'GET') return json({ error: 'method not allowed' }, env, 405);

      // Defense in depth: Cloudflare Access already gates the subdomain, but we
      // independently verify the Access JWT here (adr/0003). Any failure → 403,
      // with no detail leaked to the caller.
      try {
        await verifyAccessJwt(request, env);
      } catch {
        return json({ error: 'unauthorized' }, env, 403);
      }

      return json(await readAggregate(env), env);
    }

    return json({ error: 'not found' }, env, 404);
  },

  /**
   * Phase 3 pipeline (placeholder). Pulls from App Store Connect (App Store
   * Connect API, signed with a private key) and Firebase / Google Analytics,
   * aggregates into a {@link MetricsPayload}, and writes it to METRICS_KV under
   * `latest`. All credentials come from Worker secrets — never the repo.
   */
  async scheduled(_event: ScheduledController, env: Env, _ctx: ExecutionContext): Promise<void> {
    // TODO(phase-3): fetch → aggregate → env.METRICS_KV.put(KV_KEY, JSON.stringify(payload)).
    // No-op until the pipeline is implemented.
    void env;
  },
};

/** Read the stored aggregate; fall back to a labelled sample if none exists yet. */
async function readAggregate(env: Env): Promise<MetricsPayload> {
  const stored = await env.METRICS_KV.get(KV_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as MetricsPayload;
    } catch {
      // Corrupt or hand-edited KV value — don't 500 the dashboard; serve the
      // labelled sample so the UI stays up while the store is fixed.
      console.error('METRICS_KV "latest" is not valid JSON; serving sample payload');
    }
  }
  return stubPayload();
}

function corsHeaders(env: Env): Record<string, string> {
  const origin = env.ALLOWED_ORIGIN?.trim();
  // A specific origin lets us safely allow credentials (needed for the
  // Cloudflare Access cookie). `*` + credentials is invalid per the CORS spec
  // and browsers block it, so without an explicit origin we drop credentials.
  if (origin && origin !== '*') {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'cf-access-jwt-assertion, content-type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      Vary: 'Origin',
    };
  }
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'cf-access-jwt-assertion, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };
}

function json(body: unknown, env: Env, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...corsHeaders(env) },
  });
}
