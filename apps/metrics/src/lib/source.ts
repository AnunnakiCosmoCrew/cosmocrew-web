import {
  METRICS_CONTRACT_VERSION,
  type MetricsPayload,
} from '@cosmocrew/metrics-contract';
import { apps, MONTH_LABELS } from './metrics';

/**
 * The single seam between the dashboard UI and its data. Every page reads its
 * numbers from here, in the shape of the shared {@link MetricsPayload} contract.
 *
 * - **Phase 1 (now):** returns synthetic sample data (see `metrics.ts`) mapped
 *   into the contract. Runs at build time; nothing private is involved.
 * - **Phase 3 (later):** a static build must not hold private data, so the
 *   dashboard will instead fetch the *same* payload at runtime from the gated
 *   Worker API (`services/metrics-api`), client-side:
 *
 *   ```ts
 *   // In a client script, once PUBLIC_METRICS_API is configured:
 *   const res = await fetch(`${import.meta.env.PUBLIC_METRICS_API}/api/metrics`, {
 *     credentials: 'include', // send the Cloudflare Access cookie
 *   });
 *   const payload = (await res.json()) as MetricsPayload;
 *   ```
 *
 *   Because the pages already consume {@link MetricsPayload}, switching the
 *   source is a localized change — the charts and cards don't move.
 */
export function getMetrics(): MetricsPayload {
  return {
    version: METRICS_CONTRACT_VERSION,
    // Fixed, not `Date.now()`, so the static build stays byte-for-byte stable.
    generatedAt: '2026-07-01T00:00:00.000Z',
    sample: true,
    months: [...MONTH_LABELS],
    apps: apps.map((a) => ({
      slug: a.slug,
      name: a.name,
      color: a.color,
      months: a.months,
      retention: a.retention,
    })),
  };
}
