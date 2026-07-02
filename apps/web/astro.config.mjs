// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// --- Deployment target -------------------------------------------------------
// Deployed as the GitHub *org* Pages site (repo: anunnakicosmocrew.github.io),
// served from the domain root:
//   https://anunnakicosmocrew.github.io/
//
// To move to the custom domain cosmocrew.dev later, change just one line:
//   site: 'https://cosmocrew.dev',
// then add `public/CNAME` containing `cosmocrew.dev`. Every internal link is
// built with `withBase()` (src/lib/url.ts), so nothing else needs to change.
// -----------------------------------------------------------------------------
export default defineConfig({
  site: 'https://anunnakicosmocrew.github.io',
  base: '/',
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [sitemap()],
});
