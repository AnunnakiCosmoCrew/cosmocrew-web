# 6. Serve the public site at the org root as the org Pages site

- Status: Accepted
- Date: 2026-07-02
- Deciders: CosmoCrew
- Amends: [0001](0001-static-astro-site-on-github-pages.md) (base-path detail)

## Context

Per ADR 0001 the public site deployed as a GitHub **project** Pages site, served
from the sub-path `https://anunnakicosmocrew.github.io/cosmocrew-web/`. The org
root URL was occupied by a tiny separate repo (`anunnakicosmocrew.github.io`)
whose only job was to redirect `/` to `/cosmocrew-web/`.

The sub-path URL is uglier, the redirect repo is an extra moving part, and the
custom-domain move (`cosmocrew.dev`) has no fixed date. GitHub serves a repo at
the org root only if the repo is named exactly `anunnakicosmocrew.github.io`.

## Decision

Rename this monorepo to **`anunnakicosmocrew.github.io`**, making it the org
Pages site served from the domain root, and set `base: '/'` in
`apps/web/astro.config.mjs`. The old redirect repo was renamed aside to
`org-root-redirect-retired` (kept, not deleted, until the move is verified).

Because every internal link is built with `withBase()` (ADR 0001), the flip was
config-only: `base`, the `robots.txt` sitemap URL, and documentation.

## Consequences

- The site lives at the clean root URL `https://anunnakicosmocrew.github.io/`;
  the redirect repo is retired.
- The repo name is locked to the exact string `anunnakicosmocrew.github.io` —
  a slightly odd name for a monorepo that also contains the metrics app and
  Worker, but cosmetic only. GitHub redirects the old
  `github.com/AnunnakiCosmoCrew/cosmocrew-web` URLs (git remotes keep working).
- Old deep links to `…github.io/cosmocrew-web/...` now 404 — GitHub does not
  redirect Pages sub-path URLs. Accepted at current traffic levels.
- The `cosmocrew.dev` move shrinks further: change `site:`, add `public/CNAME`,
  point DNS (base is already `/`).
- The `withBase()` linking rule stays mandatory even though the base is now
  `/`, so the site survives any future base-path change unchanged.
