/** Number / currency / delta formatting shared by cards, axes, and tooltips. */

const groupFmt = new Intl.NumberFormat('en-US');
const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** 1,234 */
export function number(n: number): string {
  return groupFmt.format(Math.round(n));
}

/** $1,234 */
export function currency(n: number): string {
  return currencyFmt.format(Math.round(n));
}

/** 1.2k / 3.4M — used for tight chart axes. */
export function compact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return trim(n / 1_000_000) + 'M';
  if (abs >= 1_000) return trim(n / 1_000) + 'k';
  return String(Math.round(n));
}

/** $1.2k — compact currency for axes. */
export function currencyCompact(n: number): string {
  return '$' + compact(n);
}

/** 4.7 */
export function rating(n: number): string {
  return n.toFixed(1);
}

/** 34% */
export function percent(n: number): string {
  return Math.round(n) + '%';
}

function trim(n: number): string {
  return n.toFixed(1).replace(/\.0$/, '');
}

export type DeltaDir = 'up' | 'down' | 'flat';
export interface Delta {
  text: string;
  dir: DeltaDir;
}

/** Period-over-period change as a signed percentage with a direction. */
export function pctDelta(curr: number, prev: number): Delta {
  if (!prev) return { text: '—', dir: 'flat' };
  const d = ((curr - prev) / prev) * 100;
  const dir: DeltaDir = d > 0.5 ? 'up' : d < -0.5 ? 'down' : 'flat';
  const sign = d > 0 ? '+' : '';
  return { text: `${sign}${d.toFixed(1)}%`, dir };
}

/** Absolute-point delta for rating (e.g. +0.1). */
export function pointDelta(curr: number, prev: number): Delta {
  const d = curr - prev;
  const dir: DeltaDir = d > 0.04 ? 'up' : d < -0.04 ? 'down' : 'flat';
  const sign = d > 0 ? '+' : '';
  return { text: `${sign}${d.toFixed(1)}`, dir };
}
