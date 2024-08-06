import type { ImageMetadata } from 'astro'
import { getCollection, getEntryBySlug, type ContentEntryMap } from 'astro:content'
import dayjs from 'dayjs'
import { remark } from 'remark'
import stripMarkdown from 'strip-markdown'
import type { GalleryImage } from '~/components/Content/Gallery'
import type { BreadcrumbLink } from '~/types/breadcrumbs.types'

export type Collection = keyof ContentEntryMap
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Entry = any
export type EntryReference = string | Entry

interface CollectionConfig {
  readonly uri?: string

  readonly referencesInPage: Collection[]
  readonly referencesInLink: Collection[]

  readonly hasKnowledge?: boolean
}

export const COLLECTIONS: Collection[] = [
  'article',
  'career',
  'challenge',
  'database',
  'development',
  'education',
  'framework',
  'language',
  'message-broker',
  'page',
  'project',
  'technology',
]

const COLLECTION_LINK_ORDER: Collection[] = [
  'development',
  'language',
  'framework',
  'technology',
  'database',
  'message-broker',
]

const DEFAULT_COLLECTION_CONFIG: CollectionConfig = {
  referencesInPage: ['development', 'language', 'framework', 'technology', 'message-broker', 'database'],
  referencesInLink: ['development', 'language', 'framework'],
}

const COLLECTION_CONFIG = {
  language: {
    hasKnowledge: true,
    referencesInPage: ['development', 'language', 'framework', 'technology', 'message-broker', 'database'],
  },
  framework: {
    hasKnowledge: true,
    referencesInPage: ['development', 'language', 'framework', 'technology', 'message-broker', 'database'],
  },
  development: {
    referencesInPage: ['language', 'framework', 'technology', 'message-broker', 'database'],
    referencesInLink: ['development', 'language', 'framework'],
  },
  project: {
    referencesInPage: ['development', 'language', 'framework', 'technology', 'message-broker', 'database'],
    referencesInLink: ['development', 'language', 'framework'],
  },
  career: {
    referencesInPage: ['development', 'language', 'framework', 'technology', 'message-broker', 'database'],
  },
} satisfies Partial<Record<Collection, Partial<CollectionConfig>>>

export function getCollectionConfig(collection?: Collection): CollectionConfig {
  if (collection) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { ...DEFAULT_COLLECTION_CONFIG, ...(COLLECTION_CONFIG as any)[collection] }
  }

  return DEFAULT_COLLECTION_CONFIG
}

export function getEntryCollectionConfig(entry?: Entry): CollectionConfig {
  if (!entry) {
    return DEFAULT_COLLECTION_CONFIG
  }

  return getCollectionConfig(entry.collection)
}

export async function getEntryFromReference(ref?: string): Promise<Entry | undefined> {
  if (!ref) {
    return
  }

  const parts = ref.split('/')
  if (parts.length < 2) {
    return
  }

  const [collection, ...slugs] = parts as [Collection, string[]]
  const slug = slugs.join('/')

  return (await getEntryBySlug(collection, slug)) as Entry
}

export async function getEntriesFromReferences(refs?: EntryReference[]): Promise<Entry[]> {
  if (!refs?.length) {
    return []
  }

  if (typeof refs[0] === 'string') {
    return await Promise.all(refs.map(getEntryFromReference))
  }

  return refs
}

export async function getSortedEntriesFromReferences(refs?: EntryReference[]): Promise<Entry[]> {
  return sortEntries(await getEntriesFromReferences(refs))
}

export async function getSortedGroupedEntriesFromReferences(
  refs?: EntryReference[],
): Promise<Partial<Record<Collection, Entry[]>>> {
  const entries = await getSortedEntriesFromReferences(refs)

  return groupEntriesByCollection(entries)
}

export function groupEntriesByCollection(entries: Entry[]): Partial<Record<Collection, Entry[]>> {
  return entries.reduce(
    (result, entry) => {
      if (!entry) {
        return result
      }

      result[entry.collection] = [...(result[entry.collection] ?? []), entry]
      return result
    },
    {} as Partial<Record<Collection, Entry[]>>,
  )
}

export function sortEntries(entries: Entry[]): Entry[] {
  return entries.sort(entrySortFn)
}

export function entrySortFn(entryA: Entry, entryB: Entry): number {
  if (entryA.collection === entryB.collection) {
    // Sort by order
    if (entryA.data.order !== undefined || entryB.data.order !== undefined) {
      return entryA.data.order - entryB.data.order
    }

    // Sort by created
    const dateA = getEntryCreatedAt(entryA)
    const dateB = getEntryCreatedAt(entryB)
    if (dateA || dateB) {
      return dayjs(dateB).diff(dateA)
    }

    return 0
  }

  const orderA = COLLECTION_LINK_ORDER.indexOf(entryA.collection)
  const orderB = COLLECTION_LINK_ORDER.indexOf(entryB.collection)
  if (orderA === -1) {
    return 1
  }
  if (orderB === -1) {
    return -1
  }

  return orderA - orderB
}

export async function getAllEntries(collections: Collection[] = COLLECTIONS): Promise<Entry[]> {
  return (await Promise.all(collections.map((collection) => getCollection(collection)))).flat()
}

export async function getReferencesForEntry(entry?: Entry, collections: Collection[] = COLLECTIONS): Promise<Entry[]> {
  if (!entry) {
    return []
  }

  // From references
  const directReferences: string[] = []
  if (
    entry.data &&
    typeof entry.data === 'object' &&
    'references' in entry.data &&
    Array.isArray(entry.data.references)
  ) {
    directReferences.push(...entry.data.references)
  }

  // Other nodes
  const allEntries = await getAllEntries(collections)
  return allEntries
    .filter((it) => getEntryIsRoot(it))
    .sort(entrySortFn)
    .filter((it) => {
      return (
        directReferences.includes(`${it.collection}/${it.slug}`) ||
        it.data.references?.includes(`${entry.collection}/${entry.slug}`)
      )
    })
}

export function getEntryLink(entry: Entry): string {
  return `/${entry.collection}/${entry.slug}`
}

const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/image/**/*.{jpeg,jpg,png,gif}')

export async function getEntryImage(entry: Entry): Promise<ImageMetadata | undefined> {
  return await getImageMetadata(entry.data.featuredImage)
}

export async function getEntryGalleryImages(entry: Entry): Promise<GalleryImage[]> {
  const galleryImages: string[] = entry.data.galleryImages ?? []
  const galleryImagesMetadata = (await Promise.all(galleryImages.map(getImageMetadata))).filter(
    Boolean,
  ) as ImageMetadata[]

  return galleryImagesMetadata.map((image) => ({ image, title: '?' }))
}

export async function getImageMetadata(src?: string): Promise<ImageMetadata | undefined> {
  if (!src) {
    return
  }

  return (await Object.entries(images).find((it) => it[0].includes(src))?.[1]?.())?.default
}

export function getEntryCreatedAt(entry: Entry): Date | undefined {
  if (entry.data.createdAt) {
    return dayjs(entry.data.createdAt).toDate()
  }
  if (entry.data.startDate) {
    return dayjs(entry.data.startDate).toDate()
  }
  if (entry.data.publishedAt) {
    return dayjs(entry.data.publishedAt).toDate()
  }

  return undefined
}

export async function getEntrySummaryContent(entry: Entry, onlyExplicit = true): Promise<string> {
  if (entry.data.summary && typeof entry.data.summary === 'string') {
    return entry.data.summary
  }

  if (entry.data.summary && 'raw' in entry.data.summary) {
    return entry.data.summary?.raw
  }

  if (onlyExplicit) {
    return ''
  }

  if ('body' in entry && typeof entry.body === 'string') {
    return entry.body.split('\n').filter(Boolean)[0]
  }

  if ('render' in entry) {
    const render = await entry.render()
    return render.rawContent()
  }

  return ''
}

export async function getEntrySummary(entry: Entry): Promise<string> {
  const result = await remark()
    .use(stripMarkdown)
    .process(await getEntrySummaryContent(entry))

  return String(result)
}

export function getEntryBreadcrumbs(entry: Entry): BreadcrumbLink[] {
  const parts = entry.slug.split('/').slice(0, -1) as string[]
  return parts.reduce(
    (result, part) => {
      const last = result[result.length - 1]?.link ?? '/'

      return [...result, { title: part, link: `${last}/${part}` }]
    },
    [{ title: entry.collection, link: `/${entry.collection}` }] as BreadcrumbLink[],
  )
}

export function getEntryIsRoot(entry: Entry): boolean {
  return entry.slug.split('/').length === 1
}

export function getEntryIsLog(slug?: string): boolean {
  return slug?.includes('/log') ?? false
}

export async function getEntryLogs(collection: Collection, slug: string): Promise<Entry[]> {
  let entrySlug = slug
  if (getEntryIsLog(slug)) {
    entrySlug =
      slug
        ?.split('/')
        .filter((it) => it !== 'log')
        .slice(0, -1)
        .reverse()[0] ?? ''
  }

  const entries = await getCollection(collection, (it) => it.slug.includes(`${entrySlug}/log/`))

  return entries.sort(entrySortFn)
}

export interface NearEntries {
  previous?: Entry
  next?: Entry
}

/**
 * Gets near entries, previous and next
 * @param collection
 * @param entry
 * @returns previous and next entries
 */
export async function getNearEntries(collection: Collection, entry: Entry): Promise<NearEntries> {
  return getNearEntriesFromLogs(collection, entry)
}

async function getNearEntriesFromLogs(collection: Collection, entry: Entry): Promise<NearEntries> {
  if (!getEntryIsLog(entry.slug)) {
    return {}
  }

  const entrySlug = entry.slug?.split('/').slice(0, -2).reverse()[0]
  const logs = await getEntryLogs(collection, entrySlug)
  const currentIndex = logs.findIndex((it) => it.slug === entry.slug)

  return {
    previous: logs[currentIndex - 1],
    next: logs[currentIndex + 1],
  }
}
