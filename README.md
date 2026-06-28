# CosmoCrew Web

The public website for **CosmoCrew**, a small independent software studio. It is
a fast, minimal, static site that showcases our live products and links to their
App Store pages, support, and docs.

- **Framework:** [Astro](https://astro.build) (static output, TypeScript)
- **Styling:** hand-written modern CSS with design tokens (no UI framework)
- **Hosting:** GitHub Pages, deployed via GitHub Actions
- **Live URL:** https://anunnakicosmocrew.github.io/cosmocrew-web/

This repository contains **public content only**. It holds no private data and
no authentication — see [Future private metrics dashboard](#future-private-metrics-dashboard).

## Requirements

- **Node.js 24+** (an `.nvmrc` is included). With [nvm](https://github.com/nvm-sh/nvm):

  ```bash
  nvm use        # or: nvm install 24
  ```

## Commands

Run from the project root:

| Command           | Action                                                        |
| ----------------- | ------------------------------------------------------------- |
| `npm install`     | Install dependencies                                          |
| `npm run dev`     | Start the dev server at `http://localhost:4321/cosmocrew-web/` |
| `npm run check`   | Type-check the project and content schemas (`astro check`)    |
| `npm run build`   | Build the static site to `dist/`                              |
| `npm run preview` | Preview the built site at `http://localhost:4321/cosmocrew-web/` |

> **Note the base path.** The site is served from `/cosmocrew-web/`, so the dev
> and preview servers live at `http://localhost:4321/cosmocrew-web/`, not the
> bare root.

## Project structure

```
src/
├── components/      # Nav, Footer, Hero, ProductCard, Button, Prose, …
├── layouts/         # BaseLayout (the page shell)
├── lib/url.ts       # withBase() / absoluteUrl() — base-path-safe links
├── content/
│   ├── products/    # one Markdown file per product
│   └── updates/     # changelog / blog posts
├── content.config.ts# content collection schemas
├── pages/           # routes (incl. dynamic [id].astro pages + 404)
└── styles/          # tokens.css + global.css
public/              # favicon, og image, robots.txt, .nojekyll
```

### Editing content

- **Products** live in `src/content/products/*.md`. The filename is the URL slug
  (`slicefocus.md` → `/products/slicefocus/`). Frontmatter fields are validated
  by the schema in `src/content.config.ts`; the `links` block only renders the
  keys you provide.
- **Updates** live in `src/content/updates/*.md`. Set `draft: true` to hide a
  post from the build.
- The Home and Products pages derive entirely from the products collection, so
  there is a single source of truth for the lineup.

### Linking rule (important)

Because the site is served from a sub-path, **never hand-write internal links as
`/path`** — they would point at the domain root and 404. Always build internal
URLs with the helper:

```astro
---
import { withBase } from '../lib/url';
---
<a href={withBase('products')}>Products</a>   <!-- → /cosmocrew-web/products/ -->
```

External links (App Store, GitHub, `mailto:`) are used as-is. This indirection
is also what makes the custom-domain switch below a one-line change.

## Deployment

Deployment is automated with GitHub Actions (`.github/workflows/deploy.yml`):
on every push to `main` (or a manual run from the **Actions** tab) the official
`withastro/action` builds the site and `actions/deploy-pages` publishes it.

**One-time setup:** in the repository, go to **Settings → Pages → Build and
deployment → Source** and select **GitHub Actions**. After that, every push to
`main` deploys automatically.

## Switching base path / custom domain

We own `cosmocrew.dev`. To serve the site there instead of the GitHub project
URL, make these three changes:

1. In `astro.config.mjs`, set:
   ```js
   site: 'https://cosmocrew.dev',
   base: '/',
   ```
2. Add a file `public/CNAME` containing exactly:
   ```
   cosmocrew.dev
   ```
3. Point DNS at GitHub Pages (a `CNAME`/`ALIAS` record for the apex domain) and
   set the custom domain under **Settings → Pages**. Update the `Sitemap:` URL in
   `public/robots.txt` to the new domain.

No template or content edits are needed — every internal link uses `withBase()`,
which automatically resolves against the new base.

## Future private metrics dashboard

We eventually want crew members to log in and view **private CosmoCrew metrics**.
That is intentionally **not** part of this site, and must never be.

**This repository is a public, static GitHub Pages site.** Anything committed
here — HTML, JavaScript, JSON, Markdown, environment variables — is world-readable
once deployed. GitHub Pages cannot host private data and cannot perform real
authentication. Client-side "checks" such as `if (isCrewMember) showMetrics()`
are **not** security; the data would still ship to every visitor. Therefore this
repo contains **zero** private metrics and **no** gating logic.

Private metrics belong in a **separate, authenticated application** on its own
subdomain:

| Surface                 | What it serves                          | Auth                          |
| ----------------------- | --------------------------------------- | ----------------------------- |
| `cosmocrew.dev`         | This public site (product showcase)     | None — public                 |
| `metrics.cosmocrew.dev` | Private metrics dashboard (future)      | Required — see below          |

**Recommended future authentication** for the metrics app:

- Put it behind **Cloudflare Access**.
- Use **GitHub login** as the identity provider.
- Restrict access to **members of the `AnunnakiCosmoCrew` GitHub organization**.

The dashboard would be deployed and secured entirely separately from this
repository. No private data or access-control logic should ever be added here.

## License

© CosmoCrew. All rights reserved.
