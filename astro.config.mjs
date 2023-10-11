import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import tailwind from '@astrojs/tailwind';
import { VitePWA } from "vite-plugin-pwa";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind()],
  output: "static",
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Local File Sharing',
          short_name: 'Local File Sharing',
          description: 'Local File Sharing Website',
          background_color: '#222',
          theme_color: '#ACACAC',
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