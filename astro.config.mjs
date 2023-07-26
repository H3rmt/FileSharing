import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";

import deno from "@astrojs/deno";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],
  output: "server",
  adapter: deno({
    port: 8081,
    hostname: 'localhost',
  })
});