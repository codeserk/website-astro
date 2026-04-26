import { test, expect } from '@playwright/test'

test.describe('Static pages', () => {
  test.describe('About Me', () => {
    test('should load the page', async ({ page }) => {
      // Act
      await page.goto('/about-me')

      // Assert
      await expect(page).toHaveURL('/about-me')
    })

    test('should display content', async ({ page }) => {
      // Arrange
      await page.goto('/about-me')

      // Act
      const content = page.locator('.PageContent')

      // Assert
      await expect(content).toBeVisible()
    })
  })

  test.describe('Journal', () => {
    test('should load the page', async ({ page }) => {
      // Act
      await page.goto('/journal')

      // Assert
      await expect(page).toHaveURL('/journal')
    })

    test('should display log entries', async ({ page }) => {
      // Arrange
      await page.goto('/journal')

      // Act
      const entries = page.locator('.logs-container').first()

      // Assert
      await expect(entries).toBeVisible()
    })
  })

  test.describe('Resume', () => {
    test('should load the page', async ({ page }) => {
      // Act
      await page.goto('/resume')

      // Assert
      await expect(page).toHaveURL('/resume')
    })

    test('should display career entries', async ({ page }) => {
      // Arrange
      await page.goto('/resume')

      // Act
      const content = page.locator('body')

      // Assert
      await expect(content).toContainText('codeserk')
    })
  })

  test.describe('Security and Cookies', () => {
    test('should load the page', async ({ page }) => {
      // Act
      await page.goto('/security-and-cookies')

      // Assert
      await expect(page).toHaveURL('/security-and-cookies')
      await expect(page.locator('body')).toContainText('cookie')
    })
  })

  test.describe('404 page', () => {
    test('should display on unknown routes', async ({ page }) => {
      // Act
      const response = await page.goto('/this-page-does-not-exist')

      // Assert
      expect(response?.status()).toBe(404)
    })
  })
})
