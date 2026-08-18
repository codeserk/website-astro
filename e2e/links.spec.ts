import { test, expect, type APIRequestContext } from '@playwright/test'

const PRODUCTION_BASE_URL = 'https://www.codeserk.es'

/**
 * Reads every page the site publishes, straight from the generated sitemap.
 *
 * @param request playwright request context bound to the preview server
 * @returns the site-relative path of every published page
 */
async function getSitemapPaths(request: APIRequestContext): Promise<string[]> {
  const response = await request.get('/sitemap-0.xml')
  expect(response.status()).toBe(200)

  const xml = await response.text()
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].replace(PRODUCTION_BASE_URL, ''))
    .map((path) => (path.startsWith('/') ? path : `/${path}`))

  expect(paths.length).toBeGreaterThan(0)

  return paths
}

/**
 * Pulls the internal links and the images out of a rendered page.
 *
 * @param html markup of a single page
 * @returns the hrefs pointing back at the site and every image with its alt
 */
function collectAssets(html: string): { links: string[]; images: { src: string; alt: string | null }[] } {
  const tag = (name: string) => new RegExp(`<${name}\\s+((?:[^>"']|"[^"]*"|'[^']*')*)>`, 'g')
  const attribute = (attributes: string, name: string) => attributes.match(new RegExp(`\\s?${name}="([^"]*)"`))?.[1]

  const links = [...html.matchAll(tag('a'))]
    .map((match) => attribute(match[1], 'href') ?? '')
    .filter((href) => href.startsWith('/') || href.startsWith(PRODUCTION_BASE_URL))
    .map((href) => href.replace(PRODUCTION_BASE_URL, ''))
    .map((href) => href.split('#')[0])
    .filter((href) => href.length > 0)

  const images = [...html.matchAll(tag('img'))].map((match) => ({
    src: attribute(match[1], 'src') ?? '',
    alt: attribute(match[1], 'alt') ?? null,
  }))

  return { links, images }
}

test.describe('Site crawl', () => {
  test.describe.configure({ timeout: 180000 })

  test('should serve every page listed in the sitemap', async ({ request }) => {
    // Arrange
    const paths = await getSitemapPaths(request)

    // Act
    const broken: string[] = []
    for (const path of paths) {
      const response = await request.get(path)
      if (response.status() !== 200) {
        broken.push(`${path} -> ${response.status()}`)
      }
    }

    // Assert
    expect(broken).toEqual([])
  })

  test('should resolve every internal link and image, and label every image', async ({ request }) => {
    // Arrange
    const paths = await getSitemapPaths(request)
    const checked = new Set<string>()
    const broken: string[] = []
    const unlabelled: string[] = []

    // Act
    for (const path of paths) {
      const html = await (await request.get(path)).text()
      const { links, images } = collectAssets(html)

      for (const image of images) {
        if (!image.alt) {
          unlabelled.push(`${path} -> <img src="${image.src}">`)
        }
      }

      const targets = [...links, ...images.map((image) => image.src)].filter(
        (target) => target.startsWith('/') && !checked.has(target)
      )
      for (const target of targets) {
        checked.add(target)
        const response = await request.get(target)
        if (response.status() !== 200) {
          broken.push(`${path} -> ${target} (${response.status()})`)
        }
      }
    }

    // Assert
    expect(broken).toEqual([])
    expect(unlabelled).toEqual([])
  })
})
