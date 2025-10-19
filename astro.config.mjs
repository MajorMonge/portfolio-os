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
  }),
  env: {
    schema: {
      NOTION_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      NOTION_DATA_SOURCE_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      NOTION_ENTRY_PAGE_ID: envField.string({
        context: "server",
        access: "secret",
      })
    }
  }
});
