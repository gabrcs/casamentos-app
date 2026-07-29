// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import clerk from '@clerk/astro';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  // Deve bater com o path em `routes` no wrangler.toml (ex: "/{{SLUG}}").
  // Se o site for publicado na raiz do domínio, use "/".
  base: '/{{SLUG}}',
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: 'compile',
  }),
  integrations: [clerk()],
  vite: {
    plugins: [tailwindcss()],
  },
});
