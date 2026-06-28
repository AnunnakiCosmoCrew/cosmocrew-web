/**
 * URL helpers for correct linking under the GitHub Pages base path.
 *
 * The site is served from a sub-path (`/cosmocrew-web/`), so a hand-written
 * absolute path such as a leading-slash "products" link would point at the
 * domain root and 404. Always build internal links with `withBase()`. External
 * links (App Store, GitHub, mailto:, other subdomains) are passed through
 * unchanged.
 *
 * `import.meta.env.BASE_URL` reflects the configured `base` (e.g.
 * "/cosmocrew-web", or "/" on a custom domain). Its trailing slash is not
 * guaranteed across versions, so we normalise it here. Moving to cosmocrew.dev
 * later (base "/") needs no changes to this file.
 */

// Normalised base with no trailing slash: "/cosmocrew-web", or "" when base is "/".
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
