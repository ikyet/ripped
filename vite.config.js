import { defineConfig } from "vite";

// GitHub Pages project sites are served from /<repo>/, not the domain
// root, so every built asset URL needs that prefix baked in.
export default defineConfig({
  base: "/ripped/",
});
