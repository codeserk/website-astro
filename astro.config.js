import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config'
import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import remarkToc from 'remark-toc'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import { remarkShrugPlugin } from './src/plugins/shrug.remark-plugin'
import { remarkIconPlugin } from './src/plugins/icon.remark-plugin'

import sitemap from '@astrojs/sitemap'
import { remarkModifiedTime } from './src/plugins/last-modifierd.remark-plugin'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import glsl from 'vite-plugin-glsl'
import remarkGemoji from 'remark-gemoji'

dayjs.extend(localizedFormat)

/**
 * @param {string} content
 * @returns {string[]}
 */
function svgToPaths(content) {
  const paths = [...content.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((match) => match[1])

  for (const [, points] of content.matchAll(/<polygon[^>]*\spoints="([^"]+)"/g)) {
    const numbers = points.trim().split(/[\s,]+/).map(parseFloat)
    const pairs = []
    for (let i = 0; i + 1 < numbers.length; i += 2) {
      pairs.push(`${numbers[i]} ${numbers[i + 1]}`)
    }
    paths.push('M' + pairs.join(' L') + ' Z')
  }

  for (const [tag] of content.matchAll(/<rect[^>]*\/?>/g)) {
    const attr = (name) => parseFloat(tag.match(new RegExp(`\\s${name}="([^"]+)"`))?.[1] ?? '0')
    const [x, y, w, h] = [attr('x'), attr('y'), attr('width'), attr('height')]
    if (w > 0 && h > 0) {
      paths.push(`M${x} ${y} h${w} v${h} h${-w} Z`)
    }
  }

  return paths
}

/** @type {Record<string, string[]> | undefined} */
let pixelartIcons

function loadPixelartIcons() {
  if (pixelartIcons) {
    return pixelartIcons
  }

  const baseDir = new URL('./node_modules/@hackernoon/pixel-icon-library/icons/SVG', import.meta.url).pathname
  const customDir = new URL('./src/icons', import.meta.url).pathname
  pixelartIcons = {}
  const pixelartDir = new URL('./node_modules/@nsmr/pixelart-react/svg', import.meta.url).pathname
  const svgDirs = ['regular', 'solid', 'brands', 'purcats'].map((variant) => [join(baseDir, variant), ''])
  svgDirs.push([pixelartDir, 'px-'])
  svgDirs.push([customDir, ''])
  for (const [svgDir, prefix] of svgDirs) {
    if (!existsSync(svgDir)) continue
    for (const file of readdirSync(svgDir)) {
      if (!file.endsWith('.svg') || file.endsWith('-sharp.svg')) continue
      const name = prefix + file.replace('.svg', '')
      const content = readFileSync(join(svgDir, file), 'utf-8')
      const paths = svgToPaths(content)
      if (paths.length > 0) {
        pixelartIcons[name] = paths
      }
    }
  }

  return pixelartIcons
}

/**
 * @param {string} text
 * @returns {string}
 */
function replacePixelartIcons(text) {
  const icons = loadPixelartIcons()
  return text.replace(/:([a-z0-9-]+):/g, (match, name) => {
    const paths = icons[name]
    if (!paths) {
      return match
    }
    const content = paths.map((d) => `<path d="${d}"></path>`).join('')
    return `<svg class="pixel-icon" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-label="${name}">${content}</svg>`
  })
}

/** @type {import('vite').Plugin} */
const pixelartIconsPlugin = {
  name: 'virtual:pixelart-icons',
  resolveId(id) {
    if (id === 'virtual:pixelart-icons') {
      return '\0virtual:pixelart-icons'
    }
  },
  load(id) {
    if (id !== '\0virtual:pixelart-icons') {
      return
    }
    return `export const ICONS = ${JSON.stringify(loadPixelartIcons())}`
  },
}

/** @type {import('vite').Plugin} */
const pixelartIconsAstroPlugin = {
  name: 'pixelart-icons-astro',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('.astro')) {
      return
    }

    const frontmatter = code.match(/^---[\s\S]*?\n---/)?.[0] ?? ''
    const body = code.slice(frontmatter.length)
    const transformed = body
      .split(/(<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>)/)
      .map((part) => (part.startsWith('<style') || part.startsWith('<script') ? part : replacePixelartIcons(part)))
      .join('')

    return frontmatter + transformed
  },
}

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  site: 'https://www.codeserk.es',
  markdown: {
    // Astro's default smartypants converts ' -> ' (U+2019) which renders
    // oddly on mobile with the site font. Keep ASCII apostrophes everywhere.
    smartypants: false,
    remarkPlugins: [remarkToc, remarkIconPlugin, remarkGemoji, remarkShrugPlugin, remarkModifiedTime],
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
    plugins: [glsl(), pixelartIconsPlugin, pixelartIconsAstroPlugin],
  },
})
