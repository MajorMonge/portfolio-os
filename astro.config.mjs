// @ts-check
import { defineConfig, envField } from 'astro/config';

import preact from '@astrojs/preact';

import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: node({
    mode: 'standalone'
  })
});
