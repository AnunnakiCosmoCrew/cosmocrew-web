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

### Other static-site generators

All of these produce static output that would host fine on GitHub Pages; the
choice came down to authoring ergonomics for a TypeScript/GitHub-centric team and
the "minimal JS, single source of truth for products" brief.

- **Eleventy (11ty)** — excellent, lightweight, also zero-JS by default, but has
  no first-class component model or scoped styling out of the box and leans on
  Nunjucks/Liquid templating. Astro's `.astro` components (JSX-like, scoped CSS)
  and **typed** content collections were preferred for maintainability.
- **Hugo** — extremely fast builds, but Go templating is unfamiliar to the team
  and it sits outside the JS/TS ecosystem, making component authoring and shared
  tooling more awkward for little benefit at this size.
- **Gatsby** — React-based; ships a React runtime and pushes a GraphQL data layer
  that is overkill for a handful of Markdown products, working against the
  near-zero-JS goal.
- **VitePress / Docusaurus** — strong SSGs but opinionated toward documentation
  sites, not a marketing/brochure layout; we'd fight the theme.
- **SvelteKit / Nuxt static export** — capable of static builds, but oriented
  around an app/SSR model and ship a client framework runtime by default —
  heavier than a static launcher needs.

Astro was chosen as the one option that pairs **static output + near-zero client
JS** with a **typed component model and content collections**, so adding a
product is a data edit and internal links stay type-safe.
