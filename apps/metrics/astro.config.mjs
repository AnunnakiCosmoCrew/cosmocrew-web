// @ts-check
import { defineConfig } from 'astro/config';

// --- Deployment target -------------------------------------------------------
// PRIVATE metrics dashboard. This app is deployed SEPARATELY from the public
// site — to Cloudflare Pages at https://metrics.cosmocrew.dev, gated at the
// edge by Cloudflare Access (GitHub org membership). It is NEVER part of the
// GitHub Pages build (see adr/0002 and adr/0003).
//
// Served from the domain root, so `base` is '/'. The app ships no private data
// in the build; in production it reads aggregates at runtime from the gated
// Worker API. During Phase 1 it renders synthetic sample data only.
// -----------------------------------------------------------------------------
export default defineConfig({
  site: 'https://metrics.cosmocrew.dev',
  base: '/',
  trailingSlash: 'ignore',
  output: 'static',
});
