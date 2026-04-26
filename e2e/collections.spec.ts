import { test, expect } from '@playwright/test'

const COLLECTIONS = [
  { path: '/blog', title: 'Blog', linkClass: '.PageLink' },
  { path: '/project', title: 'Projects', linkClass: '.PageLink' },
  { path: '/career', title: 'Career', linkClass: '.PageCareerLink' },
  { path: '/challenge', title: 'Challenges', linkClass: '.PageChallengeLink' },
  { path: '/language', title: 'Languages', linkClass: '.PageLink' },
  { path: '/framework', title: 'Frameworks', linkClass: '.PageLink' },
  { path: '/technology', title: 'Technologies', linkClass: '.PageLink' },
  { path: '/database', title: 'Databases', linkClass: '.PageLink' },
  { path: '/model', title: 'Models', linkClass: '.PageLink' },
]

test.describe('Collection listing pages', () => {
  for (const { path, title, linkClass } of COLLECTIONS) {
    test.describe(title, () => {
      test(`should load ${path} page`, async ({ page }) => {
        // Act
        await page.goto(path)

        // Assert
        await expect(page).toHaveURL(path)
        await expect(page.locator('body')).toBeVisible()
      })

      test(`should display entry links on ${path}`, async ({ page }) => {
        // Arrange
        await page.goto(path)

        // Act
        const link = page.locator(linkClass).first()

        // Assert
        await expect(link).toBeVisible()
      })
    })
  }
})
