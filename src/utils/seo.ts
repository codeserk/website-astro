import type { BreadcrumbLink } from '~/types/breadcrumbs.types'

export interface SEOParams {
  readonly title?: string
  readonly breadcrumbs?: BreadcrumbLink[]
  readonly description?: string
  readonly keywords?: string[]
  readonly image?: string
  readonly path?: string
}

export const SEO_SITE_NAME = 'José Cámara [@codeserk]'
export const SEO_CANONICAL_URL = 'https://www.codeserk.es'
export const SEO_AUTHOR = 'José Cámara'
export const TITLE_SEPARATOR = '  ▪  '

export const DEFAULT_SEO_PARAMS: SEOParams = {
  title: 'José Cámara [@codeserk]',
  description:
    "José Cámara's personal portfolio, meant to showcase all the projects I work on, and the new technologies or languages that I use.",
  keywords: [
    'portfolio',
    'developer',
    'web development',
    'typescript',
    'javascript',
    'nestjs',
    'vue',
    'game development',
    'codeserk',
    'html',
  ],
  image: '/header.png',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateSeoMeta(params?: SEOParams): any {
  let url = SEO_CANONICAL_URL + (params?.path ?? '')
  if (url !== SEO_CANONICAL_URL && !url.endsWith('/')) {
    url += '/'
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const head: any = {
    link: [
      {
        rel: 'canonical',
        href: url,
      },
    ],
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metas: any[] = []
  metas.push({ property: 'og:url', hid: 'og:url', content: url })
  const title = params?.breadcrumbs
    ? [SEO_SITE_NAME, ...params.breadcrumbs.map((it) => capitalize(it.title)), params.title]
        .filter(Boolean)
        .reverse()
        .join(TITLE_SEPARATOR)
    : params?.title
      ? `${params.title}${TITLE_SEPARATOR}${SEO_SITE_NAME}`
      : DEFAULT_SEO_PARAMS.title
  head.title = title
  metas.push({ property: 'og:title', hid: 'og:title', content: title })
  metas.push({ property: 'twitter:title', hid: 'twitter:title', content: title })

  const description = params?.description ? getShortDescription(params?.description) : DEFAULT_SEO_PARAMS.description
  metas.push({ name: 'description', hid: 'description', content: description })
  metas.push({ property: 'og:description', hid: 'og:description', content: description })
  metas.push({ property: 'twitter:description', hid: 'twitter:description', content: description })

  const keywords = params?.keywords ?? DEFAULT_SEO_PARAMS.keywords
  metas.push({ name: 'keywords', hid: 'keywords', content: keywords?.join(',') })

  const image = SEO_CANONICAL_URL + (params?.image || DEFAULT_SEO_PARAMS.image)
  // const image = info.image || defaultSeo.image
  metas.push({ property: 'og:image', hid: 'og:image', content: image })
  metas.push({ property: 'og:image:type', hid: 'og:image:type', content: 'image/png' })
  metas.push({ property: 'og:image:width', hid: 'og:image:width', content: 600 })
  metas.push({ property: 'og:image:width', hid: 'og:image:height', content: 600 })
  metas.push({ property: 'twitter:image', hid: 'twitter:image', content: image })

  // Twitter card
  metas.push({ property: 'twitter:card', content: 'summary_large_image' })
  metas.push({ property: 'twitter:site', content: 'codeserk.es' })
  metas.push({ property: 'twitter:creator', content: '@codeserk' })

  return { ...head, meta: metas }
}

export function getShortDescription(description: string): string {
  return [description.replace(/<\/?[^>]+(>|$)/g, ''), DEFAULT_SEO_PARAMS.description].join('\n')
}

function capitalize(text: string): string {
  return text
    .split(' ')
    .map((words) => {
      const [first, ...rest] = words.split('')

      return [first?.toUpperCase() ?? '', ...rest].join('')
    })
    .join(' ')
}
