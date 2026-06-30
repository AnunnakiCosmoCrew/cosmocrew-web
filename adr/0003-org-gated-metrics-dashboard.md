# 3. Org-gated metrics dashboard via Cloudflare Access + GitHub

- Status: Accepted (planned — not yet implemented)
- Date: 2026-06-30
- Deciders: CosmoCrew

> Implementation will live in the `cosmocrew-metrics` repo, not in
> `cosmocrew-web`. This record captures the decision; mirror or move it to that
> repo when the work begins.

## Context

Crew members need to view private CosmoCrew metrics (downloads, revenue, usage).
Access must be restricted to members of the `AnunnakiCosmoCrew` GitHub
organization, with **real, server-side / edge-enforced** authentication — never
client-side gating (see [ADR 0002](0002-no-private-data-in-the-public-site.md)).
The domain `cosmocrew.dev` is on Cloudflare; the team's identity already lives in
GitHub.

## Decision

Build a **separate application** at `metrics.cosmocrew.dev`, gated at the network
edge:

- **Auth gate:** Cloudflare Access (Cloudflare Zero Trust) in front of the whole
  subdomain, with **GitHub** as the identity provider. The Access policy allows
  only identities that belong to the `AnunnakiCosmoCrew` org (optionally narrowed
  to a specific team). Enforcement happens at Cloudflare's edge before the app
  loads. Free for up to 50 users.
- **Defense in depth:** the app's backend verifies the Cloudflare Access JWT
  (audience tag + Cloudflare public keys), so a direct origin request without a
  valid token returns nothing.
- **Hosting:** Cloudflare Pages (UI) + a Cloudflare Worker (data API). GCP Cloud
  Run behind Cloudflare is an acceptable alternative.
- **Data pipeline:** a scheduled job (Cloudflare Cron Worker or a GCP scheduler)
  pulls from App Store Connect, Firebase / Google Analytics, and the app backends
  into a small aggregate store (Cloudflare D1/KV or Postgres). The dashboard reads
  only the aggregate.
- **Secrets:** all API keys live server-side only (Cloudflare secrets / GCP
  Secret Manager); none ever reaches the browser.

## Consequences

- Authentication is enforced at the edge with no auth/session code to build or
  maintain in the app itself; membership is sourced directly from GitHub.
- Free at the studio's scale; clean separation from the public site.
- Adds a dependency on Cloudflare Zero Trust and a small data pipeline to operate,
  plus the one-time setup of a GitHub OAuth app and Access policy.

## Alternatives considered

- **App-level OAuth + session management** — more code and attack surface;
  reimplements what Cloudflare Access provides for free.
- **In-app GitHub OAuth with an org-membership check** — workable, but pushes
  identity logic into the app and is easier to get subtly wrong.
- **IP allowlist / HTTP basic auth** — weak and unmanageable for a small,
  distributed crew.
