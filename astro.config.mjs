import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://sacramento-unb.github.io",
  output: "static",
  integrations: [sitemap({ filter: page => !page.endsWith("/404.html") })],
});
