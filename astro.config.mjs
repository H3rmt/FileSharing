import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import { VitePWA } from "vite-plugin-pwa"

import deno from "@astrojs/deno";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],
  output: "server",
  adapter: deno({
    port: 8081,
    hostname: '192.168.187.13',
  }),
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Local File Sharing',
          short_name: 'LFS',
          description: 'Local File Sharing Website',
          background_color: '#222',
          theme_color: '#fff',
          icons: [
            {
              src: '/favicon.svg',
              type: 'image/svg',
              sizes: '128x128',
            },
            {
              src: '/astro.png',
              type: 'image/png',
              sizes: '512x512',
            }
          ]
        }
      })
    ]
  }
});