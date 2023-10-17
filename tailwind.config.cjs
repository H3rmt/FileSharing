/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        "background-accent": "hsl(var(--background-accent))",
        text: "hsl(var(--text))",
        accent: "hsl(var(--accent))",
        border: "hsl(var(--border))",
      },
      backgroundImage: {
        textbg: "var(--textbg)",
        "img-background": "var(--img-background)",
      },
    },
  },
  plugins: [],
};
