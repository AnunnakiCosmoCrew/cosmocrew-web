# 4. Product cards link to the apps' own sites; no internal detail pages

- Status: Accepted (supersedes the original internal-detail-page approach)
- Date: 2026-06-30
- Deciders: CosmoCrew

## Context

The first version of the site had internal product detail pages at
`/products/<slug>`, generated from the product Markdown bodies. However, each
live product already has its own full marketing site (`slicefocus.app`,
`lexipower.app`), so the internal detail pages largely duplicated content that is
maintained better elsewhere.

## Decision

Product cards link **directly to each app's own website**, implemented as a
"stretched link" so clicking anywhere on the card (except the chips) opens the
site. The redundant internal `/products/<slug>` detail pages were removed, and
the product Markdown files are now **data-only frontmatter**. App Store, Docs, and
Support remain as per-card chips that stay independently clickable.

The studio site therefore acts as a clean **launcher** to the apps rather than a
second place to describe them.

## Consequences

- Less duplicated content to keep in sync; fewer pages to maintain.
- The card is a single, obvious call to action straight to the product.
- Trade-off: less first-party indexable content on `cosmocrew.dev` itself — the
  app sites carry that SEO weight instead. Acceptable, since each app site is the
  canonical home for its product.
- Reversible: detail pages can be reintroduced later by re-adding a `[id]` route
  that renders the product Markdown body.

## Alternatives considered

- **Keep internal detail pages as the card target** — rejected; duplicates the
  app sites and adds maintenance for little gain.
- **Keep detail pages reachable via a secondary "Details" link** — rejected for
  v1 to keep the site minimal; can revisit if first-party SEO becomes a priority.
