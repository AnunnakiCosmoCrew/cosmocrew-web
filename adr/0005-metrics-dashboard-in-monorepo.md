# 5. Metrics dashboard lives in the cosmocrew-web monorepo

- Status: Accepted
- Date: 2026-07-01
- Deciders: CosmoCrew
- Supersedes: the **repo-placement** clause of [ADR 0003](0003-org-gated-metrics-dashboard.md)

## Context

[ADR 0003](0003-org-gated-metrics-dashboard.md) decided to build the private
metrics dashboard as a **separate application**, and further noted its code would
live in a **separate `cosmocrew-metrics` repo**. Before that repo was created, we
chose to keep everything in one place: the dashboard should live in the same
repository as the public site, sharing its design system.

The security boundary from [ADR 0002](0002-no-private-data-in-the-public-site.md)
is non-negotiable: the public GitHub Pages build is world-readable, so it must
contain zero private data and zero gating logic. "Same repo" must therefore not
mean "same deployment".

## Decision

Restructure `cosmocrew-web` as a small **npm-workspaces monorepo** and keep the
metrics dashboard here, deployed separately:

```
apps/web       → public site      → GitHub Pages          (unchanged boundary)
apps/metrics   → private dashboard → Cloudflare Pages @ metrics.cosmocrew.dev
packages/design→ shared design tokens (single source of truth)
```

- **Two independent deploys.** CI builds and publishes **only `apps/web`** to
  GitHub Pages (`npm run build:web` → `apps/web/dist`). `apps/metrics` is never
  built or uploaded by the Pages workflow, so no dashboard code or data can reach
  the public origin.
- **`apps/metrics` deploys to Cloudflare Pages** at `metrics.cosmocrew.dev`,
  gated at the edge by Cloudflare Access exactly as ADR 0003 specifies. The
  build ships **no private data**; production reads aggregates at runtime from
  the gated Worker API. (During Phase 1 it renders synthetic sample data only.)
- **Everything else in ADR 0003 still stands** — Cloudflare Access + GitHub IdP,
  the Worker data API with JWT verification, the scheduled pipeline, and
  server-side-only secrets. Only the *location of the code* changes: this repo
  instead of a separate `cosmocrew-metrics` repo.
- **ADR 0002 remains in force, unchanged.** The public build's "no private data"
  invariant is still verified by grepping the Pages artifact before release; the
  monorepo does not weaken it because the artifact is `apps/web/dist` only.

## Consequences

- One repo, one design system (`packages/design`), no cross-repo drift; changing
  a token updates both surfaces at once.
- The public/private boundary moves from "different repo" to "different deploy
  target". This is a slightly sharper thing to get right, so it is enforced in CI
  (the Pages job builds only `apps/web`) and re-checked by the ADR 0002 grep.
- The Pages workflow no longer uses `withastro/action`; it installs the workspace
  from the root lockfile and builds the web app explicitly, because the action's
  single-project install does not fit a workspace root.
- A future split back into a standalone `cosmocrew-metrics` repo remains possible:
  `apps/metrics` + `packages/design` are self-contained.

## Alternatives considered

- **Separate `cosmocrew-metrics` repo (original ADR 0003 plan)** — cleaner
  isolation, but duplicates the design system and tooling and adds a second repo
  to run for a one-person studio. Rejected in favor of a shared monorepo.
- **Put the dashboard in the public site build behind a client-side check** —
  rejected by ADR 0002; GitHub Pages is world-readable and the data would ship to
  everyone.
