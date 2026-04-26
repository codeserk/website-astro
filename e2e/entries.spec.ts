import { test, expect } from '@playwright/test'

const SAMPLE_ENTRIES = [
  { path: '/blog/lets-go-for-it', collection: 'Blog' },
  { path: '/project/catrisma', collection: 'Project' },
  { path: '/career/coosto', collection: 'Career' },
  { path: '/language/typescript', collection: 'Language' },
  { path: '/framework/react', collection: 'Framework' },
  { path: '/technology/docker', collection: 'Technology' },
  { path: '/database/mongodb', collection: 'Database' },
]

test.describe('Entry detail pages', () => {
  for (const { path, collection } of SAMPLE_ENTRIES) {
    test.describe(`${collection}: ${path}`, () => {
      test('should load the page', async ({ page }) => {
        // Act
        await page.goto(path)

        // Assert
        await expect(page).toHaveURL(path)
      })

      test('should display a header with the entry title', async ({ page }) => {
        // Arrange
        await page.goto(path)

        // Act
        const header = page.locator('.PageHeader, h1').first()

        // Assert
        await expect(header).toBeVisible()
        await expect(header).not.toBeEmpty()
      })

      test('should display content', async ({ page }) => {
        // Arrange
        await page.goto(path)

        // Act
        const content = page.locator('.PageContent')

        // Assert
        await expect(content).toBeVisible()
      })
    })
  }
})
