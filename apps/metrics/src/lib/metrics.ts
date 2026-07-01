/**
 * SAMPLE metrics — synthetic, deterministic, and obviously fake. This exists so
 * the dashboard UI can be built and reviewed without any real business data.
 *
 * No real CosmoCrew numbers live here or anywhere in this repo (see adr/0002).
 * In production (Phase 3) the dashboard fetches aggregates at runtime from the
 * gated Worker API and this module is replaced by that data source.
 *
 * Values are generated from a fixed seed so every build is identical (no
 * Date/Math.random drift) and the charts look stable.
 */

export type AppSlug = 'slicefocus' | 'lexipower';
export type SeriesColor = 'accent' | 'ok' | 'slate';

export interface MonthPoint {
  /** Short month label, e.g. "Aug" or "Jan '26". */
  month: string;
  /** New first-time installs that month. */
  downloads: number;
  /** Re-downloads / restores that month. */
  redownloads: number;
  /** Proceeds (USD) that month. */
  revenue: number;
  /** Monthly active users. */
  mau: number;
  /** Average App Store rating snapshot that month. */
  rating: number;
  /** New reviews that month. */
  reviews: number;
}

export interface RetentionPoint {
  label: string;
  pct: number;
}

export interface AppMetrics {
  slug: AppSlug;
  name: string;
  /** Identity color used consistently across every chart. */
  color: SeriesColor;
  months: MonthPoint[];
  retention: RetentionPoint[];
}

/** Rolling 12-month window ending at the current period (sample). */
export const MONTH_LABELS = [
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  "Jan '26",
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
] as const;

/** Small deterministic PRNG so sample data is stable across builds. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface AppSeed {
  slug: AppSlug;
  name: string;
  color: SeriesColor;
  seed: number;
  downloads0: number;
  downloadGrowth: number;
  redownloadRatio: number;
  mau0: number;
  mauGrowth: number;
  /** Revenue per MAU (rough ARPU proxy). */
  arpu: number;
  ratingBase: number;
  reviewRatio: number;
  retention: number[];
}

const SEEDS: AppSeed[] = [
  {
    slug: 'slicefocus',
    name: 'SliceFocus',
    color: 'accent',
    seed: 1337,
    downloads0: 520,
    downloadGrowth: 1.1,
    redownloadRatio: 0.22,
    mau0: 1400,
    mauGrowth: 1.11,
    arpu: 0.18,
    ratingBase: 4.6,
    reviewRatio: 0.02,
    retention: [52, 34, 27, 19],
  },
  {
    slug: 'lexipower',
    name: 'LexiPower',
    color: 'ok',
    seed: 92017,
    downloads0: 300,
    downloadGrowth: 1.17,
    redownloadRatio: 0.18,
    mau0: 800,
    mauGrowth: 1.18,
    arpu: 0.22,
    ratingBase: 4.7,
    reviewRatio: 0.025,
    retention: [58, 41, 33, 25],
  },
];

const RETENTION_LABELS = ['Day 1', 'Day 7', 'Day 14', 'Day 30'];

function buildApp(s: AppSeed): AppMetrics {
  const rand = mulberry32(s.seed);
  const months: MonthPoint[] = MONTH_LABELS.map((month, i) => {
    const jitter = (spread: number) => 1 - spread / 2 + rand() * spread;
    const downloads = Math.round(
      s.downloads0 * Math.pow(s.downloadGrowth, i) * jitter(0.16),
    );
    const redownloads = Math.round(downloads * s.redownloadRatio * jitter(0.2));
    const mau = Math.round(s.mau0 * Math.pow(s.mauGrowth, i) * jitter(0.1));
    const revenue = Math.round(mau * s.arpu * jitter(0.18));
    const rating = Math.min(
      4.9,
      Math.max(4.3, s.ratingBase + i * 0.008 + (rand() - 0.5) * 0.12),
    );
    const reviews = Math.round(downloads * s.reviewRatio * jitter(0.4));
    return {
      month,
      downloads,
      redownloads,
      revenue,
      mau,
      rating: Math.round(rating * 10) / 10,
      reviews,
    };
  });

  return {
    slug: s.slug,
    name: s.name,
    color: s.color,
    months,
    retention: s.retention.map((pct, i) => ({ label: RETENTION_LABELS[i], pct })),
  };
}

export const apps: AppMetrics[] = SEEDS.map(buildApp);

export function getApp(slug: string): AppMetrics | undefined {
  return apps.find((a) => a.slug === slug);
}
