# 1. Public site is an Astro static site on GitHub Pages

- Status: Accepted
- Date: 2026-06-30
- Deciders: CosmoCrew

## Context

CosmoCrew needs a clean, professional, budget-friendly public website to showcase
its live products. Requirements: minimal and fast, easy to maintain and extend,
no backend or database, and cheap (ideally free) to host. The team already uses
GitHub (org `AnunnakiCosmoCrew`) and owns `cosmocrew.dev` via Cloudflare.

## Decision

Build the site with **Astro** (static output, TypeScript) and deploy it to
**GitHub Pages** via GitHub Actions (`withastro/action`).

- **Styling:** hand-written modern CSS with design tokens (CSS custom
  properties), dark mode via `prefers-color-scheme`, near-zero client JS. No
  Tailwind or UI framework.
- **Content:** product data lives in Astro content collections
  (`src/content/products/*.md`) — a single source of truth for the lineup.
- **Routing under a base path:** the site is served from a sub-path
  (`/cosmocrew-web/`). All internal links are built through a `withBase()` helper
  (`src/lib/url.ts`) so they resolve correctly, and switching to the
  `cosmocrew.dev` apex later is a ~3-line config change (`base: '/'`, `site`, plus
  a `public/CNAME`) with no template edits.

## Consequences

- Zero hosting cost, no server or database to operate; fast static delivery.
- Automatic deploy on every push to `main`; the build is reproducible in CI.
- Custom-domain-ready with negligible effort.
- Hand-written CSS keeps the output tiny and gives full control over the calm
  aesthetic, at the cost of writing layout/utilities by hand rather than reaching
  for framework classes.

## Alternatives considered

- **Next.js / other SSR framework** — overkill for a brochure site; wants a
  running server and adds cost/complexity.
- **Tailwind CSS** — heavier build surface and easier to drift toward visual
  clutter, which works against the minimal brief.
- **Hand-written HTML/CSS** — no content modelling; adding a product would mean
  editing markup instead of data.
