import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import remarkToc from 'remark-toc'
import preact from '@astrojs/preact'

import tailwind from '@astrojs/tailwind'
import { remarkShrugPlugin } from './src/plugins/shrug.remark-plugin'

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  markdown: {
    remarkPlugins: [remarkToc, remarkShrugPlugin],
    rehypePlugins: [rehypeAccessibleEmojis],
  },
  integrations: [mdx(), preact(), tailwind()],
})
