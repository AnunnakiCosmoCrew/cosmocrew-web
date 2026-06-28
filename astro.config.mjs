// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// --- Deployment target -------------------------------------------------------
// Currently deployed to GitHub *project* Pages:
//   https://anunnakicosmocrew.github.io/cosmocrew-web/
//
// To move to the custom domain cosmocrew.dev later, change just these two lines:
//   site: 'https://cosmocrew.dev',
//   base: '/',
// then add `public/CNAME` containing `cosmocrew.dev`. Every internal link is
// built with `withBase()` (src/lib/url.ts), so nothing else needs to change.
// -----------------------------------------------------------------------------
export default defineConfig({
  site: 'https://anunnakicosmocrew.github.io',
  base: '/cosmocrew-web',
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [sitemap()],
});
