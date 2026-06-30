# 2. No private data or authentication in the public site

- Status: Accepted
- Date: 2026-06-30
- Deciders: CosmoCrew

## Context

CosmoCrew eventually wants crew members to log in and view **private metrics**.
The public website (`cosmocrew-web`) is a public, static GitHub Pages build:
everything committed to it — HTML, JS bundles, JSON, Markdown, environment
variables — is world-readable once deployed. A static site cannot perform real
authentication, and any client-side "check" would still ship the protected data
to every visitor.

## Decision

The public site contains **zero private metrics data and zero gating logic**.

- No metrics values, queries, or credentials appear in any page, component,
  data file, or build output.
- The product schema includes a `metricsEnabled` field for forward
  compatibility, but it is always `false` and is **never rendered**.
- No client-side access control of any kind (e.g. `if (isCrewMember) {...}`).
- Private metrics are served by a **separate, authenticated application** on its
  own subdomain — see [ADR 0003](0003-org-gated-metrics-dashboard.md).

This boundary is verified before each release by grepping the build output for
metrics references and forbidden product names.

## Consequences

- The public/private security boundary is unambiguous and easy to audit; the
  repository can remain public with no risk of leaking private data.
- Metrics work is fully decoupled from the website and can evolve independently.
- Viewing private metrics requires building and operating a separate app, which
  is a deliberate, accepted cost.

## Alternatives considered

- **Client-side gating on the static site** — rejected; not secure, the data
  still ships to the browser.
- **Obfuscating/encoding metrics in the static build** — rejected; security by
  obscurity, still fundamentally public.
