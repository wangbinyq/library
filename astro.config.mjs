import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://wangbinyq.github.io",
  base: "/library/",
  trailingSlash: "always",
  build: { format: "directory" },
});
