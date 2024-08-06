import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import remarkToc from 'remark-toc'
import preact from '@astrojs/preact'
import tailwind from '@astrojs/tailwind'
import { remarkShrugPlugin } from './src/plugins/shrug.remark-plugin'

import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  site: 'https://codeserk.github.io',
  markdown: {
    remarkPlugins: [remarkToc, remarkShrugPlugin],
    rehypePlugins: [rehypeAccessibleEmojis],
  },
  integrations: [
    mdx(),
    preact(),
    tailwind(),
    sitemap({
      serialize(item) {
        // TODO - add changemod when is possible
        return {
          url: item.url,
        }
      },
    }),
  ],
})
