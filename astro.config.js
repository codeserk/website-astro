import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import remarkToc from 'remark-toc'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import { remarkShrugPlugin } from './src/plugins/shrug.remark-plugin'

import sitemap from '@astrojs/sitemap'
import { remarkModifiedTime } from './src/plugins/last-modifierd.remark-plugin'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import glsl from 'vite-plugin-glsl'

dayjs.extend(localizedFormat)

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  site: 'https://www.codeserk.es',
  markdown: {
    remarkPlugins: [remarkToc, remarkShrugPlugin, remarkModifiedTime],
    rehypePlugins: [rehypeAccessibleEmojis],
  },
  integrations: [
    mdx(),
    react(),

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
  vite: {
    plugins: [glsl()],
  },
})
