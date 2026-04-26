import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    // Arrange
    await page.goto('/')
  })

  test('should have the correct title', async ({ page }) => {
    // Assert
    await expect(page).toHaveTitle('José Cámara [@codeserk]')
  })

  test('should display the header with name', async ({ page }) => {
    // Arrange
    const heading = page.locator('h1')

    // Assert
    await expect(heading).toContainText('Cámara')
    await expect(heading).toContainText('@codeserk')
  })

  test.describe('sections', () => {
    test('should display the About Me section', async ({ page }) => {
      // Arrange
      const section = page.locator('section h2', { hasText: 'About Me' })

      // Assert
      await expect(section).toBeVisible()
    })

    test('should display the Journal section', async ({ page }) => {
      // Arrange
      const section = page.locator('section h2', { hasText: 'Journal' })

      // Assert
      await expect(section).toBeVisible()
    })

    test('should display the Blog section', async ({ page }) => {
      // Arrange
      const section = page.locator('section h2', { hasText: 'Blog' })

      // Assert
      await expect(section).toBeVisible()
    })

    test('should display the Languages section', async ({ page }) => {
      // Arrange
      const section = page.locator('section h2', { hasText: 'Languages' })

      // Assert
      await expect(section).toBeVisible()
    })

    test('should display the Challenges section', async ({ page }) => {
      // Arrange
      const section = page.locator('section h2', { hasText: 'Last challenges' })

      // Assert
      await expect(section).toBeVisible()
    })

    test('should display the Career section', async ({ page }) => {
      // Arrange
      const section = page.locator('section h2', { hasText: 'Career' })

      // Assert
      await expect(section).toBeVisible()
    })

    test('should display the Web development section', async ({ page }) => {
      // Arrange
      const section = page.locator('section h2', { hasText: 'Web development' })

      // Assert
      await expect(section).toBeVisible()
    })

    test('should display the Projects section', async ({ page }) => {
      // Arrange
      const section = page.locator('section h2', { hasText: /^Projects/ })

      // Assert
      await expect(section).toBeVisible()
    })

    test('should display the Models section', async ({ page }) => {
      // Arrange
      const section = page.locator('section h2', { hasText: 'Models' })

      // Assert
      await expect(section).toBeVisible()
    })
  })
})
