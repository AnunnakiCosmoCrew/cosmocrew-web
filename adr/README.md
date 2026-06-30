# Architecture Decision Records

Significant architecture decisions for CosmoCrew Web and the surrounding
public / private architecture, in a short [MADR](https://adr.github.io/madr/)-style format.

ADRs are immutable once **Accepted**. To change a decision, add a new ADR that
supersedes the old one and mark the old one **Superseded**.

| #                                                | Decision                                                       | Status            |
| ------------------------------------------------ | -------------------------------------------------------------- | ----------------- |
| [0001](0001-static-astro-site-on-github-pages.md) | Public site is an Astro static site on GitHub Pages            | Accepted          |
| [0002](0002-no-private-data-in-the-public-site.md) | No private data or auth in the public site                     | Accepted          |
| [0003](0003-org-gated-metrics-dashboard.md)       | Org-gated metrics dashboard via Cloudflare Access + GitHub     | Accepted (planned) |
| [0004](0004-cards-link-to-app-sites.md)           | Product cards link to the apps' own sites; no detail pages     | Accepted          |

> ADR 0003 describes a separate future app. Its implementation will live in the
> `cosmocrew-metrics` repo — mirror/move this record there when that work begins.
