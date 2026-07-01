/**
 * The metrics wire contract. This is the single agreement between the
 * `metrics-api` Worker (which produces it) and the dashboard (which renders it).
 *
 * It intentionally carries no secrets and no query logic — only the shape of the
 * aggregate the dashboard needs. Bump {@link METRICS_CONTRACT_VERSION} on any
 * breaking change so both sides can guard.
 */

/** Identity color for a series, resolved to a design token in the dashboard. */
export type SeriesColor = 'accent' | 'ok' | 'slate';

/** One month of aggregate numbers for a single app. */
export interface MetricPointDTO {
  /** Short month label, e.g. "Aug" or "Jan '26". */
  month: string;
  /** New first-time installs. */
  downloads: number;
  /** Re-downloads / restores. */
  redownloads: number;
  /** Proceeds (USD). */
  revenue: number;
  /** Monthly active users. */
  mau: number;
  /** Average App Store rating snapshot. */
  rating: number;
  /** New reviews. */
  reviews: number;
}

/** A single point on a retention curve (e.g. Day 1, Day 7). */
export interface RetentionPointDTO {
  label: string;
  pct: number;
}

/** Full metric history for one app. */
export interface AppMetricsDTO {
  slug: string;
  name: string;
  color: SeriesColor;
  months: MetricPointDTO[];
  retention: RetentionPointDTO[];
}

/** The complete payload the `/api/metrics` endpoint returns. */
export interface MetricsPayload {
  /** Contract version; see {@link METRICS_CONTRACT_VERSION}. */
  version: number;
  /** ISO timestamp the aggregate was generated. */
  generatedAt: string;
  /** true when the payload is synthetic sample data, not real metrics. */
  sample: boolean;
  /** Ordered month labels shared by every app series. */
  months: string[];
  apps: AppMetricsDTO[];
}

export declare const METRICS_CONTRACT_VERSION: number;
