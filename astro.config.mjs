import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import { VitePWA } from "vite-plugin-pwa";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Local File Sharing",
          short_name: "Local File Sharing",
          description: "Local File Sharing Website",
          background_color: "#222",
          theme_color: "#ACACAC",
          icons: [
            {
              src: "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
  },
});
