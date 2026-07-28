import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import type { Nodes, Root } from 'mdast'
import { findAndReplace } from 'mdast-util-find-and-replace'
import type { Plugin } from 'unified'

function svgToPaths(content: string): string[] {
  const paths = [...content.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((match) => match[1])

  for (const [, points] of content.matchAll(/<polygon[^>]*\spoints="([^"]+)"/g)) {
    const numbers = points
      .trim()
      .split(/[\s,]+/)
      .map(parseFloat)
    const pairs = []
    for (let i = 0; i + 1 < numbers.length; i += 2) {
      pairs.push(`${numbers[i]} ${numbers[i + 1]}`)
    }
    paths.push('M' + pairs.join(' L') + ' Z')
  }

  for (const [tag] of content.matchAll(/<rect[^>]*\/?>/g)) {
    const attr = (name: string): number => parseFloat(tag.match(new RegExp(`\\s${name}="([^"]+)"`))?.[1] ?? '0')
    const [x, y, w, h] = [attr('x'), attr('y'), attr('width'), attr('height')]
    if (w > 0 && h > 0) {
      paths.push(`M${x} ${y} h${w} v${h} h${-w} Z`)
    }
  }

  return paths
}

let icons: Record<string, string[]> | undefined

function getIcons(): Record<string, string[]> {
  if (icons) {
    return icons
  }

  icons = {}
  const baseDir = new URL('../../node_modules/@hackernoon/pixel-icon-library/icons/SVG', import.meta.url).pathname
  const customDir = new URL('../icons', import.meta.url).pathname
  const pixelartDir = new URL('../../node_modules/@nsmr/pixelart-react/svg', import.meta.url).pathname
  const svgDirs: [string, string][] = ['regular', 'solid', 'brands', 'purcats'].map((variant) => [
    join(baseDir, variant),
    '',
  ])
  svgDirs.push([pixelartDir, 'px-'])
  svgDirs.push([customDir, ''])
  for (const [svgDir, prefix] of svgDirs) {
    if (!existsSync(svgDir)) {
      continue
    }
    for (const file of readdirSync(svgDir)) {
      if (!file.endsWith('.svg') || file.endsWith('-sharp.svg')) {
        continue
      }
      const name = prefix + file.replace('.svg', '')
      const content = readFileSync(join(svgDir, file), 'utf-8')
      const paths = svgToPaths(content)
      if (paths.length > 0) {
        icons[name] = paths
      }
    }
  }

  return icons
}

export const remarkIconPlugin: Plugin<null[], Root> = () => {
  function transformer(tree: Nodes): void {
    findAndReplace(tree, [
      /:([a-z0-9-]+):/g,
      (_match: string, name: string) => {
        const paths = getIcons()[name]
        if (!paths) {
          return false
        }

        return {
          type: 'mdxJsxTextElement',
          name: 'svg',
          attributes: [
            { type: 'mdxJsxAttribute', name: 'class', value: 'pixel-icon' },
            { type: 'mdxJsxAttribute', name: 'viewBox', value: '0 0 24 24' },
            { type: 'mdxJsxAttribute', name: 'width', value: '1em' },
            { type: 'mdxJsxAttribute', name: 'height', value: '1em' },
            { type: 'mdxJsxAttribute', name: 'fill', value: 'currentColor' },
            { type: 'mdxJsxAttribute', name: 'aria-label', value: name },
          ],
          children: paths.map((d) => ({
            type: 'mdxJsxTextElement',
            name: 'path',
            attributes: [{ type: 'mdxJsxAttribute', name: 'd', value: d }],
            children: [],
          })),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      },
    ])
  }

  return transformer
}
