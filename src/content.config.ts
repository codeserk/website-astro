import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const COLLECTIONS = [
  'blog',
  'career',
  'challenge',
  'database',
  'development',
  'education',
  'framework',
  'language',
  'message-broker',
  'model',
  'page',
  'project',
  'technology',
] as const

/**
 * Builds the entry id the way the legacy content collections did: path without
 * extension, `index` files collapsed onto their folder, and an explicit
 * `slug` in the frontmatter winning over both.
 *
 * @param entry path of the file relative to the collection folder
 * @param data parsed frontmatter of the entry
 * @returns the id used in urls and references
 */
function generateId({ entry, data }: { entry: string; data: Record<string, unknown> }): string {
  if (typeof data.slug === 'string' && data.slug.length > 0) {
    return data.slug
  }

  return entry.replace(/\.[^.]+$/, '').replace(/(^|\/)index$/, '')
}

/**
 * Declares one collection per content folder, loading both markdown flavours.
 *
 * @param name folder under `src/content`
 * @returns the collection definition
 */
function contentCollection(name: string) {
  return defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${name}`, generateId }),
  })
}

export const collections = Object.fromEntries(COLLECTIONS.map((name) => [name, contentCollection(name)])) as Record<
  (typeof COLLECTIONS)[number],
  ReturnType<typeof contentCollection>
>
