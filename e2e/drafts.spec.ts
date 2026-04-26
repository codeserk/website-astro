import { test, expect } from '@playwright/test'

test.describe('Draft entries', () => {
  test('should not show draft projects on the home page', async ({ page }) => {
    // Arrange
    await page.goto('/')

    // Act
    const body = page.locator('body')

    // Assert
    await expect(body).not.toContainText('Jukuren')
  })

  test('should not show draft projects on the projects listing', async ({ page }) => {
    // Arrange
    await page.goto('/project')

    // Act
    const content = page.locator('.PageLinksGrid')

    // Assert
    await expect(content).toBeVisible()
    await expect(content).not.toContainText('Jukuren')
  })

  test('should not generate a page for draft entries', async ({ page }) => {
    // Act
    const response = await page.goto('/project/jukuren')

    // Assert
    expect(response?.status()).toBe(404)
  })
})
