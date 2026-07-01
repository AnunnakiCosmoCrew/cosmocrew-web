import {
  METRICS_CONTRACT_VERSION,
  type MetricsPayload,
} from '@cosmocrew/metrics-contract';

/**
 * A clearly-labelled sample payload returned when the aggregate store is empty
 * (i.e. before the Phase 3 pipeline runs). It lets the dashboard render end to
 * end against a real API response. Replaced by real aggregates read from
 * METRICS_KV once the scheduled job populates them.
 *
 * Deliberately tiny — the real generator lives with the dashboard; this is just
 * enough shape to prove the wire works.
 */
const MONTHS = ['Apr', 'May', 'Jun', 'Jul'];

export function stubPayload(): MetricsPayload {
  return {
    version: METRICS_CONTRACT_VERSION,
    generatedAt: '2026-07-01T00:00:00.000Z',
    sample: true,
    months: MONTHS,
    apps: [
      {
        slug: 'slicefocus',
        name: 'SliceFocus',
        color: 'accent',
        months: [
          { month: 'Apr', downloads: 1180, redownloads: 240, revenue: 612, mau: 3600, rating: 4.6, reviews: 22 },
          { month: 'May', downloads: 1150, redownloads: 250, revenue: 655, mau: 3850, rating: 4.6, reviews: 21 },
          { month: 'Jun', downloads: 1290, redownloads: 268, revenue: 720, mau: 4090, rating: 4.7, reviews: 26 },
          { month: 'Jul', downloads: 1370, redownloads: 285, revenue: 794, mau: 4309, rating: 4.7, reviews: 28 },
        ],
        retention: [
          { label: 'Day 1', pct: 52 },
          { label: 'Day 7', pct: 34 },
          { label: 'Day 14', pct: 27 },
          { label: 'Day 30', pct: 19 },
        ],
      },
      {
        slug: 'lexipower',
        name: 'LexiPower',
        color: 'ok',
        months: [
          { month: 'Apr', downloads: 1240, redownloads: 210, revenue: 690, mau: 3520, rating: 4.7, reviews: 30 },
          { month: 'May', downloads: 1420, redownloads: 236, revenue: 812, mau: 3980, rating: 4.7, reviews: 34 },
          { month: 'Jun', downloads: 1660, redownloads: 262, revenue: 960, mau: 4470, rating: 4.8, reviews: 39 },
          { month: 'Jul', downloads: 1720, redownloads: 279, revenue: 1091, mau: 4699, rating: 4.8, reviews: 42 },
        ],
        retention: [
          { label: 'Day 1', pct: 58 },
          { label: 'Day 7', pct: 41 },
          { label: 'Day 14', pct: 33 },
          { label: 'Day 30', pct: 25 },
        ],
      },
    ],
  };
}
