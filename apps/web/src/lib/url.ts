/**
 * URL helpers for correct linking under the configured base path.
 *
 * The site is served from the domain root today (base "/"), but every internal
 * link still goes through `withBase()` so the site keeps working if it is ever
 * served from a sub-path again. External links (App Store, GitHub, mailto:,
 * other subdomains) are passed through unchanged.
 *
 * `import.meta.env.BASE_URL` reflects the configured `base` (e.g. "/", or a
 * sub-path like "/some-repo"). Its trailing slash is not guaranteed across
 * versions, so we normalise it here. Moving to cosmocrew.dev later needs no
 * changes to this file.
 */

// Normalised base with no trailing slash: "" when base is "/", or "/sub-path".
const BASE: string = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** True when the last path segment looks like a file (has an extension). */
function isFile(path: string): boolean {
  const last = path.split('/').pop() ?? '';
  return /\.[a-z0-9]+$/i.test(last);
}

/**
 * Prefix an internal, root-relative path with the deploy base.
 * Pass paths WITHOUT a leading slash, e.g. `withBase('products')` or
 * `withBase('products/slicefocus')`. Page paths get a trailing slash (matching
 * Astro's directory output); file paths (e.g. 'favicon.svg') do not. An empty
 * path returns the site root.
 */
export function withBase(path = ''): string {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '');
  if (clean === '') return `${BASE}/`;
  const tail = isFile(clean) ? '' : '/';
  return `${BASE}/${clean}${tail}`;
}

/**
 * Build an absolute URL (origin + base + path) for canonical and OpenGraph
 * tags. Uses Astro's configured `site` via `import.meta.env.SITE`.
 */
export function absoluteUrl(path = ''): string {
  return new URL(withBase(path), import.meta.env.SITE).toString();
}
