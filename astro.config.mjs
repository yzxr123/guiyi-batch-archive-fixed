import { defineConfig } from "astro/config";

// Static site, perfect for Netlify
export default defineConfig({
  site: "https://example.netlify.app",
  output: "static",
});
